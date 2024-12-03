/* eslint-disable @typescript-eslint/switch-exhaustiveness-check */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { decode } from 'uint8-base64';
import { test, expect } from 'vitest';

import { parse } from '../parse';
import { resolveRecursive } from '../resursiveResolve';

const decoder = new TextDecoder();

test('decompress zip file', async () => {
  const fileNamePath = join(__dirname, 'assets/small.xml');

  const xmlData = readFileSync(fileNamePath);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const tagValueProcessor = async (bytes: Uint8Array, node: any) => {
    if (node.tagName !== 'binary') return decoder.decode(bytes);
    const ontologies = node.parent.children.cvParam.map(
      (entry: any) => entry.attributes.accession,
    );
    return decodeBase64(bytes, { ontologies });
  };

  const result = parse(xmlData, {
    tagValueProcessor,
  }) as any;

  await resolveRecursive(result);

  const oneSpectrum =
    result.indexedmzML.mzML.run.spectrumList.spectrum[0].binaryDataArrayList;
  expect(Array.isArray(oneSpectrum.binaryDataArray[0].cvParam)).toBeTruthy();
  expect(
    ArrayBuffer.isView(oneSpectrum.binaryDataArray[0].binary),
  ).toBeTruthy();
  expect(oneSpectrum).toMatchObject({
    $count: 2,
    binaryDataArray: [
      {
        $encodedLength: 311352,
      },
      {
        $encodedLength: 114828,
      },
    ],
  });
});

export async function decodeBase64(
  base64: Uint8Array,
  options: { ontologies?: string[] } = {},
) {
  let precision;
  let compression = '';
  let float = true;
  const endian = 'little';
  const { ontologies = [] } = options;

  if (ontologies) {
    if (ontologies.includes('MS:1000519')) {
      precision = 32;
      float = false;
    }
    if (ontologies.includes('MS:1000520')) precision = 16;
    if (ontologies.includes('MS:1000521')) precision = 32;
    if (ontologies.includes('MS:1000522')) {
      float = false;
      precision = 64;
    }
    if (ontologies.includes('MS:1000523')) precision = 64;
    if (ontologies.includes('MS:1000574')) compression = 'zlib';
  }
  let uint8Array = decode(base64);
  switch (compression.toLowerCase()) {
    case 'zlib': {
      const ds = new DecompressionStream('deflate');
      const decompressedStream = new Blob([uint8Array])
        .stream()
        .pipeThrough(ds);
      const decompressedArrayBuffer = await new Response(
        decompressedStream,
      ).arrayBuffer();
      uint8Array = new Uint8Array(decompressedArrayBuffer);
      break;
    }
    case '':
    case 'none':
      break;
    default:
      throw new Error(`Unknown compression algorithm: ${compression}`);
  }

  switch (endian.toLowerCase()) {
    case 'little':
      break;
    case 'network':
    case 'big':
      {
        // we will invert in place the data
        let step;
        switch (precision) {
          case 32:
            step = 4;
            break;
          case 64:
            step = 8;
            break;
          default:
            throw new Error('Can not process bigendian file');
        }
        for (
          let i = 0;
          i < uint8Array.length - (uint8Array.length % step);
          i += step
        ) {
          for (let j = 0; j < step / 2; j++) {
            const temp = uint8Array[i + j];
            uint8Array[i + j] = uint8Array[i + step - 1 - j];
            uint8Array[i + step - 1 - j] = temp;
          }
        }
      }
      break;
    default:
      throw new TypeError(`Attributes endian not correct: ${endian}`);
  }

  /*
       We should take care that the length of the Uint8Array is correct but the buffer
       may be a little bit bigger because when decoding base 64 it may end with = or ==
       and we plan the size in the buffer.
      */
  if (float) {
    switch (precision) {
      case 32:
        return new Float32Array(uint8Array.buffer, 0, uint8Array.length / 4);
      case 64:
        return new Float64Array(uint8Array.buffer, 0, uint8Array.length / 8);
      default:
        throw new TypeError(`Incorrect precision: ${precision}`);
    }
  } else {
    switch (precision) {
      case 32:
        return new Int32Array(uint8Array.buffer, 0, uint8Array.length / 4);
      case 64:
        return new BigInt64Array(uint8Array.buffer, 0, uint8Array.length / 8);
      default:
        throw new TypeError(`Incorrect precision: ${precision}`);
    }
  }
}

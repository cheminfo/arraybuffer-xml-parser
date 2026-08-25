import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { recursiveResolve } from 'ml-spectra-processing';
import { decode } from 'uint8-base64';

import type { XMLNode } from '../src/XMLNode.ts';
import { parse } from '../src/index.ts';

interface DecodeBase64Options {
  endian?: 'little' | 'big' | 'network';
  precision?: number;
  float?: boolean;
  compression?: string;
  ontologies?: string[];
}

// Every payload is its own zlib stream, so they cannot be batched. What is
// controllable is how each one is driven and how many run at once: feeding the
// transform directly beats pipeThrough + Response, and a bound keeps thousands
// of in-flight streams from swamping the heap.
const MAX_IN_FLIGHT = 256;
let inFlight = 0;
const waiting: Array<() => void> = [];

const data = readFileSync(join(import.meta.dirname, 'big.xml'));
const decoder = new TextDecoder();

console.time('start');
const result = parse(data, {
  ignoreAttributes: false,
  tagValueProcessor: (value: Uint8Array, node: XMLNode) => {
    if (node.tagName !== 'binary') return decoder.decode(value);
    const cvParams = node.parent?.children.cvParam ?? [];
    const ontologies: string[] = [];
    for (const entry of cvParams) {
      ontologies.push(String(entry.attributes?.accession));
    }
    return decodeBase64(node.bytes, { ontologies });
  },
  attributeValueProcessor: (value) => value,
}) as Record<string, any>;
// tagValueProcessor is sync, so the binary leaves hold promises until now
await recursiveResolve(result);
console.timeEnd('start');
console.log(
  result.indexedmzML.mzML.run.spectrumList.spectrum[1].binaryDataArrayList,
);

async function decodeBase64(
  base64: Uint8Array,
  options: DecodeBase64Options = {},
) {
  const { endian = 'little', ontologies } = options;
  // 0 is not a valid precision and falls through to the same throw as undefined.
  let { precision = 0, float = true, compression = '' } = options;

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
    case 'zlib':
      uint8Array = await inflateZlib(uint8Array);
      break;
    case '':
    case 'none':
      break;
    default:
      throw new Error(`Unknow compression algorithm: ${compression}`);
  }

  switch (endian.toLowerCase()) {
    case 'little':
      break;
    case 'network':
    case 'big': {
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
          const temp = uint8Array[i + j] as number;
          uint8Array[i + j] = uint8Array[i + step - 1 - j] as number;
          uint8Array[i + step - 1 - j] = temp;
        }
      }
      break;
    }
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

/**
 * Inflate a zlib stream with the platform decompressor, so this runs unchanged
 * in the browser. 'deflate' is zlib-wrapped deflate (RFC 1950), what mzML uses.
 * @param bytes - the compressed bytes.
 * @returns the inflated bytes.
 */
async function inflateZlib(bytes: Uint8Array): Promise<Uint8Array> {
  if (inFlight >= MAX_IN_FLIGHT) {
    await new Promise<void>((resolve) => {
      waiting.push(resolve);
    });
  }
  inFlight++;
  try {
    return await inflateOne(bytes);
  } finally {
    inFlight--;
    waiting.shift()?.();
  }
}

/**
 * Drive one DecompressionStream directly, without pipeThrough or Response.
 * @param bytes - the compressed bytes.
 * @returns the inflated bytes.
 */
async function inflateOne(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new DecompressionStream('deflate');
  const writer = stream.writable.getWriter();
  void writer.write(bytes as Parameters<typeof writer.write>[0]);
  void writer.close();
  const reader = stream.readable.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    // eslint-disable-next-line no-await-in-loop -- a stream is read sequentially
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  if (chunks.length === 1) return chunks[0] as Uint8Array;
  const inflated = new Uint8Array(total);
  let at = 0;
  for (const chunk of chunks) {
    inflated.set(chunk, at);
    at += chunk.length;
  }
  return inflated;
}

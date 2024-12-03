import { decode as base64decode } from 'uint8-base64';
import { test, expect } from 'vitest';

import { parse } from '../parse.ts';
// library to convert base64 <--> arrayBuffer: https://github.com/niklasvh/base64-arraybuffer/blob/master/src/index.ts

const encoder = new TextEncoder();
const decoder = new TextDecoder();

test('base64 parsing', () => {
  const xmlData = encoder.encode(`
<binaryDataArray encodedLength="3">
  <cvParam cvRef="MS" accession="MS:1000523" name="64-bit float" value=""/>
  <cvParam cvRef="MS" accession="MS:1000574" name="test" value=""/>
  <binary>AAAAAAAA8D8AAAAAAAAAQAAAAAAAAAhA</binary>
</binaryDataArray>`);

  let result = parse(xmlData, {
    attributeNameProcessor: (name) => name,
    tagValueProcessor: (value, node) => {
      if (node.tagName !== 'binary') return decoder.decode(value);
      const decoded = base64decode(value);
      // isLittleEndian and the data were encoded in littleEndian
      return new Float64Array(decoded.buffer);
    },
  });
  expect(result.binaryDataArray.binary).toStrictEqual(
    Float64Array.from([1, 2, 3]),
  );
});

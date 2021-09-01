import { decode as base64decode } from 'base64-arraybuffer';

import { parse } from '../parse';
// library to convert base64 <--> arrayBuffer: https://github.com/niklasvh/base64-arraybuffer/blob/master/src/index.ts

const encoder = new TextEncoder();
const decoder = new TextDecoder();

test('base64 parsing', function () {
  const xmlData = encoder.encode(`
<binaryDataArray encodedLength="3">
  <cvParam cvRef="MS" accession="MS:1000523" name="64-bit float" value=""/>
  <cvParam cvRef="MS" accession="MS:1000574" name="test" value=""/>
  <binary>AAAAAAAA8D8AAAAAAAAAQAAAAAAAAAhA</binary>
</binaryDataArray>`);

  let result = parse(xmlData, {
    attributeNamePrefix: '',
    tagValueProcessor: (value, node) => {
      // console.log(node.parent.child.cvParam);
      if (node.tagName !== 'binary') return decoder.decode(value);
      const decoded = base64decode(decoder.decode(value));
      return new Float64Array(decoded);
    },
  });
  expect(result.binaryDataArray.binary).toStrictEqual(
    Float64Array.from([1, 2, 3]),
  );
});

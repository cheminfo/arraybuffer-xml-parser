import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { parse } from '../src/index.ts';

const data = readFileSync(join(import.meta.dirname, 'small.xml'));

console.time('start');
const result = parse(data, {
  ignoreAttributes: false,
  tagValueProcessor: (value) => value,
  attributeValueProcessor: (value) => value,
}) as Record<string, any>;
console.timeEnd('start');
console.log(
  result.indexedmzML.mzML.run.spectrumList.spectrum[1].binaryDataArrayList,
);

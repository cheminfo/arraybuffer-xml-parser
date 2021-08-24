const { readFileSync } = require('fs');
const { join } = require('path');

const data = readFileSync(join(__dirname, 'small.xml'));
const { parse, getTraversalObj } = require('../src/parser');

console.time('start');
const result = parse(data, {
  parseAttributeValue: false,
  ignoreAttributes: false,
  parseNodeValue: false,
  tagValueProcessor: (value, name) => {
    return value;
  },
});
console.timeEnd('start');
console.log(
  result.indexedmzML.mzML.run.spectrumList.spectrum[1].binaryDataArrayList,
);

const { readFileSync } = require('fs');
const { join } = require('path');

const data = readFileSync(join(__dirname, 'small.xml'));
const { parse } = require('../lib/index.js');

console.time('start');
const result = parse(data, {
  dynamicTypingAttributeValue: false,
  ignoreAttributes: false,
  dynamicTypingNodeValue: false,
  tagValueProcessor: (value, name) => {
    return value;
  },
});
console.timeEnd('start');
console.log(
  result.indexedmzML.mzML.run.spectrumList.spectrum[1].binaryDataArrayList,
);

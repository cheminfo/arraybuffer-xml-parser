const { readFileSync } = require('fs');
const { join } = require('path');

const data = readFileSync(join(__dirname, 'big.xml'));
const { parse } = require('../lib/index.js');

const decoder = new TextDecoder();

console.time('start');
const result = parse(data, {
  dynamicTypingAttributeValue: false,
  ignoreAttributes: false,
  dynamicTypingNodeValue: false,
  tagValueProcessor: (value, tagName) => {
    //    return decoder.decode(value);
  },
});
console.timeEnd('start');
//console.log(
//  result.indexedmzML.mzML.run.spectrumList.spectrum[1].binaryDataArrayList,
//);

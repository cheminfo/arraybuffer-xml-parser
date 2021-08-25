const { readFileSync } = require('fs');
const { join } = require('path');

const { parse } = require('../src/parser');

const fileNamePath = join(__dirname, '../src/__tests__/assets/sample.xml'); //1.5k
const xmlDataBuffer = readFileSync(fileNamePath);

console.time('start');
for (let i = 0; i < 10000; i++) {
  parse(xmlDataBuffer);
}

console.timeEnd('start');

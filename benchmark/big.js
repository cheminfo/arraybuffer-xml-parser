const { readFileSync } = require('fs');
const { join } = require('path');

const data = readFileSync(join(__dirname, 'big.xml'));
const { parse } = require('../src/parser');

console.time('start');
const result = parse(data);
console.timeEnd('start');

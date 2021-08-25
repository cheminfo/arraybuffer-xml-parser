const { readFileSync } = require('fs');
const { join } = require('path');

const data = readFileSync(join(__dirname, 'verySmall.xml'));
const { parse } = require('../src/parser');

const result = parse(data, {
  parseAttributeValue: false,
  ignoreAttributes: false,
  parseNodeValue: false,
  tagValueProcessor: (value, name) => {
    console.log('tag processor', value);
    return value;
  },
  attrValueProcessor: (value, name) => {
    console.log('attribute value processor', value);
    return value;
  },
});

console.log(result);

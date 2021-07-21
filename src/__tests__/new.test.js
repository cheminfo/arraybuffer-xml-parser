const findClosingIndex = require('../xmlbuffer2xmlnode');

const testCase = new Uint8Array([65, 68, 75, 97, 62, 86]);
findClosingIndex.findClosingIndex(testCase, 1);

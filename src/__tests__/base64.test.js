/* eslint-disable no-tabs */

import { readFileSync } from 'fs';
import { join } from 'path';

import { parse } from '../parse';

// library to convert base64 <--> arrayBuffer: https://github.com/niklasvh/base64-arraybuffer/blob/master/src/index.ts

test('base64 parsing', function () {
  const xmlData = readFileSync(join(__dirname, 'assets', 'base64.xml'));

  let result = parse(xmlData, {
    ignoreAttributes: false,
  });
});

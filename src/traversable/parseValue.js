import { parseString } from 'dynamic-typing';

import { decoder } from './getTraversable';

export function parseValue(val, options) {
  const { parseNodeValue } = options;
  if (typeof val === 'object') {
    if (val.length === 0) return '';
    let parsed = decoder.decode(val).replace(/\r/g, '');
    if (!parseNodeValue) return parsed;

    return parseString(parsed);
  } else {
    if (val === undefined) return '';
    return val.replace(/\r/g, '');
  }
}

import { arrayTrim } from '../bufferUtils/arrayTrim';

import { parseValue } from './parseValue';

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} value
 * @param {object} options
 */

export function processTagValue(tagName, value, options) {
  if (value) {
    if (options.trimValues) {
      value = arrayTrim(value);
    }
    value = parseValue(value, options, tagName);
  }
  return value;
}

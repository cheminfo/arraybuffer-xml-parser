import { arrayTrim } from '../bufferUtils/arrayTrim';

import { parseValue } from './parseValue';

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} val
 * @param {object} options
 */

export function processTagValue(tagName, val, options) {
  if (val) {
    if (options.trimValues) {
      val = arrayTrim(val);
    }
    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options);
  }

  return val;
}

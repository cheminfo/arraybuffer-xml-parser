import { XMLNode } from '../XMLNode';

import { ParseOptions } from './defaultOptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parseString } = require('dynamic-typing');

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} value
 * @param {object} options
 */

export function processTagValue(
  value: Uint8Array | string,
  options: ParseOptions,
  tagName?: string,
  currentNode?: XMLNode,
) {
  const { dynamicTypingNodeValue, tagValueProcessor } = options;

  if (tagValueProcessor) {
    value = tagValueProcessor(
      value as Uint8Array,
      currentNode as XMLNode,
      tagName,
    );
  }
  if (typeof value === 'string' && dynamicTypingNodeValue) {
    return parseString(value);
  }
  return value;
}

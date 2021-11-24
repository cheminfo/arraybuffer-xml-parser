const { parseString } =require('dynamic-typing');
import { XMLNode } from '../XMLNode';
import { optionsType } from './defaultOptions';

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} value
 * @param {object} options
 */

export function processTagValue(value: Uint8Array|string, options: optionsType, tagName?: string, currentNode?: XMLNode) {
  const { dynamicTypingNodeValue, tagValueProcessor } = options;

  if (tagValueProcessor) {
    value = tagValueProcessor(value as Uint8Array, tagName, currentNode);
  }
  if (typeof value === 'string' && dynamicTypingNodeValue) {
    return parseString(value);
  }
  return value;
}

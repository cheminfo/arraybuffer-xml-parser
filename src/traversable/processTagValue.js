import { parseString } from 'dynamic-typing';

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} value
 * @param {object} options
 */

export function processTagValue(value, options, tagName, currentNode) {
  const { dynamicTypingNodeValue, tagValueProcessor } = options;

  if (tagValueProcessor) {
    value = tagValueProcessor(value, tagName, currentNode);
  }
  if (typeof value === 'string' && dynamicTypingNodeValue) {
    return parseString(value);
  }
  return value;
}

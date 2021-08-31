import { parseString } from 'dynamic-typing';

import { decoder } from './getTraversable';

export function parseValue(value, options, tagName, currentNode) {
  const { dynamicTypingNodeValue, tagValueProcessor } = options;

  if (tagValueProcessor) {
    value = tagValueProcessor(value, tagName);
  }

  if (typeof value === 'string' && dynamicTypingNodeValue) {
    return parseString(value);
  }
  return value;
}

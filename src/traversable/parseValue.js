import { parseString } from 'dynamic-typing';

import { decoder } from './getTraversable';

export function parseValue(value, options, tagName, currentNode) {
  const { dynamicTypingNodeValue, tagValueProcessor } = options;

  if (tagValueProcessor) {
    value = tagValueProcessor(value, tagName);
  }

  if (typeof value === 'object') {
    if (value.length === 0) return '';
    let parsed = decoder.decode(value).replace(/\r/g, '');
    if (!dynamicTypingNodeValue) return parsed;

    return parseString(parsed);
  } else {
    return value === undefined ? '' : value;
  }
}

import { parseString } from 'dynamic-typing';

import { getAllMatches, isEmptyObject } from '../util';

const newLocal = '([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?';
const attrsRegx = new RegExp(newLocal, 'g');

//Attributes are strings so no point in using arrayBuffers here
export function parseAttributesString(string, options) {
  if (options.ignoreAttributes) {
    return;
  }
  string = string.replace(/\r?\n/g, ' ');

  const matches = getAllMatches(string, attrsRegx);
  const attributes = {};
  for (let match of matches) {
    const attrName = resolveNameSpace(match[1], options);
    if (attrName.length) {
      if (match[4] !== undefined) {
        if (options.trimValues) {
          match[4] = match[4].trim();
        }
        match[4] = options.attributeValueProcessor(match[4], attrName);
        attributes[attrName] = stringParseValue(
          match[4],
          options.dynamicTypingAttributeValue,
        );
      } else if (options.allowBooleanAttributes) {
        attributes[attrName] = true;
      }
    }
  }
  if (isEmptyObject(attributes)) return;
  return attributes;
}

function stringParseValue(value, shouldParse) {
  if (shouldParse && typeof value === 'string') {
    return parseString(value);
  } else {
    return value === undefined ? '' : value;
  }
}

function resolveNameSpace(tagName, options) {
  if (options.ignoreNameSpace) {
    const tags = tagName.split(':');
    const prefix = tagName.charAt(0) === '/' ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagName = prefix + tags[1];
    }
  }
  return tagName;
}

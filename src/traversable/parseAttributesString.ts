import { XMLNode } from '../XMLNode';
import { getAllMatches, isEmptyObject } from '../util';

import { OptionsType } from './defaultOptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parseString } = require('dynamic-typing');

const newLocal = '([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?';
const attrsRegx = new RegExp(newLocal, 'g');

//Attributes are strings so no point in using arrayBuffers here
export function parseAttributesString(string: string, options: OptionsType) {
  if (options.ignoreAttributes) {
    return;
  }
  string = string.replace(/\r?\n/g, ' ');

  const matches = getAllMatches(string, attrsRegx);
  const attributes: Record<string, XMLNode | boolean> = {};
  for (let match of matches) {
    const attrName = resolveNameSpace(match[1], options);
    if (attrName.length) {
      if (match[4] !== undefined) {
        if (options.trimValues) {
          match[4] = match[4].trim();
        }
        if (options.attributeValueProcessor) {
          match[4] = options.attributeValueProcessor(match[4], attrName);

          attributes[attrName] = stringParseValue(
            match[4],
            options.dynamicTypingAttributeValue as boolean,
          );
        }
      } else if (options.allowBooleanAttributes) {
        attributes[attrName] = true;
      }
    }
  }
  if (isEmptyObject(attributes)) return;
  return attributes;
}

function stringParseValue(value: string, shouldParse: boolean) {
  if (shouldParse && typeof value === 'string') {
    return parseString(value);
  } else {
    return value === undefined ? '' : value;
  }
}

function resolveNameSpace(tagName: string, options: OptionsType) {
  if (options.ignoreNameSpace) {
    const tags = tagName.split(':');
    const prefix = tagName.startsWith('/') ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagName = prefix + tags[1];
    }
  }
  return tagName;
}

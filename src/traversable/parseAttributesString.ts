import { getAllMatches, isEmptySimpleObject } from '../util.ts';

import type { RealParseOptions } from './defaultOptions.ts';

const newLocal = String.raw`([^\s=]+)\s*(=\s*(['"])(.*?)\3)?`;
const attrsRegx = new RegExp(newLocal, 'g');

//Attributes are strings so no point in using arrayBuffers here
export function parseAttributesString(
  string: string,
  options: RealParseOptions,
) {
  const {
    ignoreAttributes,
    trimValues,
    attributeValueProcessor,
    allowBooleanAttributes,
  } = options;
  if (ignoreAttributes) {
    return;
  }
  string = string.replaceAll(/\r?\n/g, ' ');

  const matches = getAllMatches(string, attrsRegx);
  // argument 1 is the key, argument 4 is the value
  const attributes: Record<string, string | number | boolean> = {};
  for (const match of matches) {
    const attributeName = resolveNamespace(match[1] as string, options);
    if (attributeName.length > 0) {
      if (match[4] !== undefined) {
        if (trimValues) {
          match[4] = match[4].trim();
        }
        if (attributeValueProcessor) {
          attributes[attributeName] = attributeValueProcessor(
            match[4],
            attributeName,
          );
        }
      } else if (allowBooleanAttributes) {
        attributes[attributeName] = true;
      }
    }
  }
  if (isEmptySimpleObject(attributes)) return;
  return attributes;
}

function resolveNamespace(tagName: string, options: RealParseOptions) {
  if (options.ignoreNameSpace) {
    const tags = tagName.split(':');
    const prefix = tagName.startsWith('/') ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2 && tags[1] !== undefined) {
      tagName = prefix + tags[1];
    }
  }
  return tagName;
}

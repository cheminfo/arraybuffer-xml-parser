import { isEmptySimpleObject } from '../util.ts';

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
  if (string.includes('\n')) {
    string = string.replaceAll(/\r?\n/g, ' ');
  }

  // argument 1 is the key, argument 4 is the value
  const attributes: Record<string, string | number | boolean> = {};
  let match: RegExpExecArray | null;
  attrsRegx.lastIndex = 0;
  while ((match = attrsRegx.exec(string)) !== null) {
    // attributeValueProcessor is user code and may re-enter this function,
    // which would move the shared regex. Restore our position after the body.
    const lastIndex = attrsRegx.lastIndex;
    const attributeName = resolveNamespace(match[1] as string, options);
    if (attributeName.length > 0) {
      const rawValue = match[4];
      if (rawValue !== undefined) {
        const value = trimValues ? rawValue.trim() : rawValue;
        if (attributeValueProcessor) {
          attributes[attributeName] = attributeValueProcessor(
            value,
            attributeName,
          );
        }
      } else if (allowBooleanAttributes) {
        attributes[attributeName] = true;
      }
    }
    attrsRegx.lastIndex = lastIndex;
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

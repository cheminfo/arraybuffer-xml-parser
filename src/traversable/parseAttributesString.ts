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

/**
 * Strip a single namespace prefix from an attribute name.
 *
 * Written without `split` because it runs once per attribute of every element:
 * a 344 MB mzML carries about 1.4 million of them, and an array allocated for
 * each is 1.4 million arrays for a question two `indexOf` calls answer.
 *
 * The bare `xmlns` case is deliberate and must not be simplified away. The
 * previous form asked `tagName.split(':')[0] === 'xmlns'`, which is true both of
 * `xmlns:mz` and of a colon-free `xmlns`, so both were dropped — an early return
 * for "no colon" would silently start keeping the second one.
 * @param tagName - The attribute's name as written.
 * @param options - The parse options, read for `ignoreNameSpace`.
 * @returns The local name, or `''` for a namespace declaration.
 */
function resolveNamespace(tagName: string, options: RealParseOptions) {
  if (!options.ignoreNameSpace) return tagName;

  const colon = tagName.indexOf(':');
  if (colon === -1) return tagName === 'xmlns' ? '' : tagName;
  if (colon === 5 && tagName.startsWith('xmlns')) return '';
  // Only a single prefix is stripped; `a:b:c` is left as it was written.
  if (tagName.includes(':', colon + 1)) return tagName;

  const local = tagName.slice(colon + 1);
  return tagName.codePointAt(0) === SLASH ? `/${local}` : local;
}

/** `/`, which opens the name of a closing tag. */
const SLASH = 47;

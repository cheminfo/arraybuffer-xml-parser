import { XMLNode } from './XMLNode';

const nameStartChar =
  ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = `${nameStartChar}\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
const nameRegexp = `[${nameStartChar}][${nameChar}]*`;
// eslint-disable-next-line no-misleading-character-class
const regexName = new RegExp(`^${nameRegexp}$`);

export function getAllMatches(string: string, regex: RegExp) {
  return Array.from(string.matchAll(regex));
}

export function isName(string: string) {
  return regexName.exec(string) !== null;
}

export function isEmptyObject(
  obj: Record<string, boolean | XMLNode | XMLNode[]>,
) {
  // fastest implementation: https://jsbench.me/qfkqv692c8/1
  // eslint-disable-next-line no-unreachable-loop
  for (const key in obj) {
    return false;
  }
  return true;
}

/**
 * Copy all the properties of a into b.
 * @param {object} target
 * @param {object} source
 */
export function merge(
  target: Record<string, any>,
  source: Record<string, any>,
  arrayMode: string,
) {
  if (!source) return;
  for (const key in source) {
    if (arrayMode === 'strict') {
      target[key] = [source[key]];
    } else {
      target[key] = source[key];
    }
  }
}

/**
 * Check if a tag name should be treated as array
 *
 * @param tagName the node tagName
 * @param arrayMode the array mode option
 * @param parentTagName the parent tag name
 * @returns {boolean} true if node should be parsed as array
 */
export function isTagNameInArrayMode(
  tagName: string,
  arrayMode:
    | ((tagName: string, parentTagName: string) => boolean)
    | string
    | boolean
    | RegExp,
  parentTagName: any,
) {
  if (arrayMode === false) {
    return false;
  } else if (arrayMode instanceof RegExp) {
    return arrayMode.test(tagName);
  } else if (typeof arrayMode === 'function') {
    return !!arrayMode(tagName, parentTagName);
  }

  return arrayMode === 'strict';
}

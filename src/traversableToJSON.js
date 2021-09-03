import { parseString } from 'dynamic-typing';

import { isTagNameInArrayMode, merge, isEmptyObject } from './util';

/**
 *
 * @param {*} node
 * @param {*} options
 * @param {*} parentTagName
 * @returns
 */
export function traversableToJSON(node, options, parentTagName) {
  const { dynamicTypingNodeValue, tagValueProcessor, arrayMode } = options;
  const result = {};

  if (tagValueProcessor) {
    node.val = node.val && tagValueProcessor(node.val, node);
  }
  if (typeof node.val === 'string' && dynamicTypingNodeValue) {
    node.val = parseString(node.val);
  }
  // when no child node or attr is present
  if (
    (!node.children || isEmptyObject(node.children)) &&
    (!node.attributes || isEmptyObject(node.attributes))
  ) {
    return node.val === undefined ? '' : node.val;
  }

  // otherwise create a textnode if node has some text
  if (node.val !== undefined && node.val.length !== 0) {
    const asArray = isTagNameInArrayMode(
      node.tagName,
      arrayMode,
      parentTagName,
    );

    result[options.textNodeName] = asArray ? [node.val] : node.val;
  }

  merge(result, node.attributes, arrayMode);

  const keys = Object.keys(node.children);
  for (let index = 0; index < keys.length; index++) {
    const tagName = keys[index];
    if (node.children[tagName] && node.children[tagName].length > 1) {
      result[tagName] = [];
      for (let tag in node.children[tagName]) {
        if (Object.prototype.hasOwnProperty.call(node.children[tagName], tag)) {
          result[tagName].push(
            traversableToJSON(node.children[tagName][tag], options, tagName),
          );
        }
      }
    } else {
      const subResult = traversableToJSON(
        node.children[tagName][0],
        options,
        tagName,
      );
      const asArray =
        (arrayMode === true && typeof subResult === 'object') ||
        isTagNameInArrayMode(tagName, arrayMode, parentTagName);
      result[tagName] = asArray ? [subResult] : subResult;
    }
  }

  return result;
}

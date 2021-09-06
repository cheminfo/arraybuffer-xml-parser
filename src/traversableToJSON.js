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
    node.value = node.value && tagValueProcessor(node.value, node);
  }
  if (typeof node.value === 'string' && dynamicTypingNodeValue) {
    node.value = parseString(node.value);
  }
  // when no child node or attr is present
  if (
    (!node.children || isEmptyObject(node.children)) &&
    (!node.attributes || isEmptyObject(node.attributes))
  ) {
    return node.value === undefined ? '' : node.value;
  }

  // otherwise create a textnode if node has some text
  if (node.value !== undefined && node.value.length !== 0) {
    const asArray = isTagNameInArrayMode(
      node.tagName,
      arrayMode,
      parentTagName,
    );

    result[options.textNodeName] = asArray ? [node.value] : node.value;
  }

  if (node.attributes && !isEmptyObject(node.attributes)) {
    let attributes = options.parseAttributesString ? {} : node.attributes;
    if (options.attributeNamePrefix) {
      // need to rename the attributes
      const renamedAttributes = {};
      for (let key in node.attributes) {
        renamedAttributes[options.attributeNamePrefix + key] =
          node.attributes[key];
      }
      attributes = renamedAttributes;
    }
    if (options.attributesNodeName) {
      let encapsulatedAttributes = {};
      encapsulatedAttributes[options.attributesNodeName] = attributes;
      attributes = encapsulatedAttributes;
    }
    merge(result, attributes, arrayMode);
  }

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

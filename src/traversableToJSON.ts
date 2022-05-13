/* eslint-disable @typescript-eslint/no-explicit-any */
import { XMLNode } from './XMLNode';
import { ParseOptions } from './traversable/defaultOptions';
import { isTagNameInArrayMode, merge, isEmptyObject } from './util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parseString } = require('dynamic-typing');

/**
 *
 * @param {*} node
 * @param {*} options
 * @param {*} parentTagName
 * @returns
 */
export async function traversableToJSON(
  node: XMLNode,
  options: ParseOptions,
  parentTagName?: string,
): Promise<string | Uint8Array | Record<string, string | Uint8Array>> {
  const {
    dynamicTypingNodeValue,
    tagValueProcessor,
    arrayMode,
    tagNameProcessor,
    attributeNameProcessor,
  } = options;
  const result: Record<string, any> = {};

  if (tagValueProcessor) {
    node.value =
      node.value && (await tagValueProcessor(node.value as Uint8Array, node));
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
      parentTagName as string,
    );

    result[options.textNodeName as string] = asArray
      ? [node.value]
      : node.value;
  }

  if (node.attributes && !isEmptyObject(node.attributes)) {
    let attributes = options.parseAttributesString ? {} : node.attributes;
    if (options.attributeNamePrefix) {
      // need to rename the attributes
      const renamedAttributes: Record<string, boolean | XMLNode> = {};
      for (let attributeName in node.attributes) {
        const newAttributeName = attributeNameProcessor
          ? attributeNameProcessor(attributeName)
          : attributeName;
        renamedAttributes[options.attributeNamePrefix + newAttributeName] =
          node.attributes[attributeName];
      }
      attributes = renamedAttributes;
    }
    if (options.attributesNodeName) {
      let encapsulatedAttributes: Record<string, any> = {};
      encapsulatedAttributes[options.attributesNodeName] = attributes;
      attributes = encapsulatedAttributes;
    }
    merge(result, attributes, arrayMode as string);
  }

  for (const tagName in node.children) {
    const newTagName = tagNameProcessor ? tagNameProcessor(tagName) : tagName;
    if (node.children[tagName] && node.children[tagName].length > 1) {
      result[tagName] = [];
      // eslint-disable-next-line @typescript-eslint/no-for-in-array
      for (let tag in node.children[tagName]) {
        if (Object.prototype.hasOwnProperty.call(node.children[tagName], tag)) {
          result[newTagName].push(
            await traversableToJSON(
              node.children[tagName][tag],
              options,
              tagName,
            ),
          );
        }
      }
    } else {
      const subResult = await traversableToJSON(
        node.children[tagName][0],
        options,
        tagName,
      );
      const asArray =
        (arrayMode === true && typeof subResult === 'object') ||
        isTagNameInArrayMode(
          tagName,
          arrayMode as string,
          parentTagName as string,
        );
      result[newTagName] = asArray ? [subResult] : subResult;
    }
  }

  return result;
}

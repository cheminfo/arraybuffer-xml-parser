import type { XMLAttributeValue, XMLNode, XMLNodeValue } from './XMLNode.ts';
import type { RealParseOptions } from './traversable/defaultOptions.ts';
import {
  isEmptyObject,
  isEmptySimpleObject,
  isTagNameInArrayMode,
  merge,
} from './util.ts';

/**
 *
 * @param node
 * @param options
 * @param parentTagName
 * @returns
 */
export function traversableToJSON(
  node: XMLNode,
  options: RealParseOptions,
  parentTagName?: string,
): XMLNodeValue | Record<string, XMLNodeValue> {
  const { arrayMode, tagNameProcessor, attributeNameProcessor, textNodeName } =
    options;
  const result: Record<string, any> = {};

  // when no child node or attr is present
  if (
    (!node.children || isEmptyObject(node.children)) &&
    (!node.attributes || isEmptySimpleObject(node.attributes))
  ) {
    return node.value;
  }

  // otherwise create a textnode if node has some text
  if (node.bytes.length > 0) {
    const asArray = isTagNameInArrayMode(
      node.tagName,
      arrayMode,
      parentTagName as string,
    );

    result[textNodeName] = asArray ? [node.value] : node.value;
  }

  if (node.attributes && !isEmptySimpleObject(node.attributes)) {
    let attributes = options.parseAttributesString ? {} : node.attributes;
    if (attributeNameProcessor) {
      // need to rename the attributes
      const renamedAttributes: Record<string, XMLAttributeValue> = {};
      for (const attributeName in node.attributes) {
        const newAttributeName = attributeNameProcessor(attributeName);
        const value = node.attributes[attributeName];
        if (value !== undefined) {
          renamedAttributes[newAttributeName] = value;
        }
      }
      attributes = renamedAttributes;
    }
    if (options.attributesNodeName) {
      const encapsulatedAttributes: Record<string, any> = {
        [options.attributesNodeName]: attributes,
      };
      attributes = encapsulatedAttributes;
    }
    merge(result, attributes, arrayMode as string);
  }

  for (const tagName in node.children) {
    const nodes = node.children[tagName];
    if (!nodes) continue;
    const newTagName = tagNameProcessor
      ? tagNameProcessor(tagName, nodes)
      : tagName;
    if (nodes.length > 1) {
      result[tagName] = [];
      for (const child of nodes) {
        result[newTagName].push(traversableToJSON(child, options, tagName));
      }
    } else {
      const firstNode = nodes[0];
      if (!firstNode) continue;
      const subResult = traversableToJSON(firstNode, options, tagName);
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

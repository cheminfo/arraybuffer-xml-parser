import type { XMLAttributeValue, XMLNode, XMLNodeValue } from './XMLNode';
import type { RealParseOptions } from './traversable/defaultOptions';
import {
  isTagNameInArrayMode,
  merge,
  isEmptyObject,
  isEmptySimpleObject,
} from './util';

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
        renamedAttributes[newAttributeName] = node.attributes[attributeName];
      }
      attributes = renamedAttributes;
    }
    if (options.attributesNodeName) {
      const encapsulatedAttributes: Record<string, any> = {};
      encapsulatedAttributes[options.attributesNodeName] = attributes;
      attributes = encapsulatedAttributes;
    }
    //@ts-expect-error Should fix this type issue
    merge(result, attributes, arrayMode as string);
  }

  for (const tagName in node.children) {
    const newTagName = tagNameProcessor ? tagNameProcessor(tagName) : tagName;
    if (node.children[tagName] && node.children[tagName].length > 1) {
      result[tagName] = [];
      // eslint-disable-next-line @typescript-eslint/no-for-in-array
      for (const tag in node.children[tagName]) {
        if (Object.hasOwn(node.children[tagName], tag)) {
          result[newTagName].push(
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

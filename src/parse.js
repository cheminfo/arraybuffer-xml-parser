import { defaultOptions } from './traversable/defaultOptions';
import { getTraversable } from './traversable/getTraversable';
import { traversableToJSON } from './traversableToJSON';

/**
 * Parse an ArrayBuffer or Uint8Array representing an XML
 * @param {ArrayBuffer|Uint8Arra} xmlData
 * @param {object} [options={}]
 * @param {string} [attributeNamePrefix='$']
 * @param {boolean} [attributesNodeName=false]
 * @param {string} [textNodeName='#text']
 * @param {boolean} [trimValues=true] should we remove ascii < 32
 * @param {boolean} [ignoreAttributes=false] skip attributes
 * @param {boolean} [ignoreNameSpace=false]
 * @param {boolean} [dynamicTypingAttributeValue=true] Parse attribute values that looks like number or boolean
 * @param {boolean} [allowBooleanAttributes=false]
 * @param {boolean} [dynamicTypingNodeValue=true] Parse tag values that looks like number or boolean
 * @param {boolean} [arrayMode=false]
 * @param {boolean} [cdataTagName=false]
 * @param {function} [tagValueProcessor=(v, node) => decoder.decode(v)] Tag values can be modified during parsing. By default we decode the tag value (a Uint8Array) using TextDecoder
 * @param {function} [attributeValueProcessor=(v) => v] Attribute values can be modified during parsing
 * @param {boolean} [stopNodes=[]] prevent further parsing
 *
 * @returns {object}
 */
export function parse(xmlData, options = {}) {
  if (typeof xmlData === 'string') {
    const encoder = new TextEncoder();
    xmlData = encoder.encode(xmlData);
  }

  if (!ArrayBuffer.isView(xmlData)) {
    xmlData = new Uint8Array(xmlData);
  }

  options = { ...defaultOptions, ...options };

  const traversable = getTraversable(xmlData, options);

  return traversableToJSON(traversable, options);
}

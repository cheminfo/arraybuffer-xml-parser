/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultOptions } from './traversable/defaultOptions';
import { getTraversable } from './traversable/getTraversable';
import { traversableToJSON } from './traversableToJSON';

/**
 * Parse an ArrayBuffer or Uint8Array representing an XML
 * @param {string|ArrayBuffer|Uint8Array} xmlData
 * @param {object} [options={}]
 * @param {string} [options.attributeNamePrefix='$']
 * @param {boolean} [options.attributesNodeName=false]
 * @param {string} [options.textNodeName='#text']
 * @param {boolean} [options.trimValues=true] should we remove ascii < 32
 * @param {boolean} [options.ignoreAttributes?:boolean=false] skip attributes
 * @param {boolean} [options.ignoreNameSpace=false]
 * @param {boolean} [options.dynamicTypingAttributeValue=true] Parse attribute values that looks like number or boolean
 * @param {boolean} [options.allowBooleanAttributes=false]
 * @param {boolean} [options.dynamicTypingNodeValue=true] Parse tag values that looks like number or boolean
 * @param {boolean} [options.arrayMode=false]
 * @param {boolean} [options.cdataTagName=false]
 * @param {function} [options.tagValueProcessor=(v, node) => decoder.decode(v)] Tag values can be modified during parsing. By default we decode the tag value (a Uint8Array) using TextDecoder
 * @param {function} [options.attributeValueProcessor=(v) => v] Attribute values can be modified during parsing
 * @param {function} [options.tagNameProcessor=(v) => v] Callback allowing to rename tag names
 * @param {function} [options.attributeNameProcessor=(v) => v] Callback allowing to rename attribute name
 * @param {boolean} [options.stopNodes=[]] prevent further parsing
 *
 * @returns {object}
 */
export interface optionsType {
  attributeNamePrefix?: string;
  attributesNodeName?: boolean;
  textNodeName?: string;
  trimValues?: boolean;
  ignoreAttributes?: boolean;
  ignoreNameSpace?: boolean;
  dynamicTypingAttributeValue?: boolean;
  allowBooleanAttributes?: boolean;
  dynamicTypingNodeValue?: boolean;
  arrayMode?: boolean |string |RegExp|((arg1:any) => boolean)|(( arg1:any, arg2?: any) => boolean);
  cdataTagName?: boolean;
  tagValueProcessor?: (v: BufferSource, node?: any) => string;
  attributeValueProcessor?: (v: BufferSource) => BufferSource;
  tagNameProcessor?: (v: any) => any;
  attributeNameProcessor?: (v: any) => any;
  stopNodes?: boolean[];
}
export function parse(
  xmlData: string | Uint8Array,
  options: optionsType = {},
): object {
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

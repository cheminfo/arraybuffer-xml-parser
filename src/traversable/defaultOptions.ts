import { XMLNode } from '../XMLNode';

const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array: Uint8Array) => {
    return utf8Decoder.decode(array);
  },
};
/**
 * ParseOptions default values
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
 * @param {function} [tagValueProcessor=(value: Uint8Array) => {return decoder.decode(value).replace(/\r/g, '');},] Tag values can be modified during parsing. By default we decode the tag value (a Uint8Array) using TextDecoder
 * @param {function} [attributeValueProcessor=(value: string) => value] Attribute values can be modified during parsing
 * @param {boolean} [stopNodes=[]] prevent further parsing
 *
 */
export interface ParseOptions {
  /**
   * @default true
   */
  trimValues?: boolean;
  /**
   * @default '$'
   */
  attributeNamePrefix?: string;
  /**
   * @default false
   */
  attributesNodeName?: string;
  /**
   * @default false
   */
  ignoreAttributes?: boolean;
  /**
   * @default false
   */
  ignoreNameSpace?: boolean;
  /**
   * @default false
   */
  allowBooleanAttributes?: boolean;
  /**
   * @default true
   */
  dynamicTypingAttributeValue?: boolean;
  /**
   * no default value
   */
  tagNameProcessor?: (arg: string) => string;
  /**
   * @default '#text'
   */
  textNodeName?: string;
  /**
   * @default true
   */
  cdataPositddionChar?: string;
  /**
   * @default true
   */
  attributeNameProcessor?: (name: string) => string;
  /**
   * @default true
   */
  parseAttributesString?: boolean;
  /**
   * @default true
   */
  dynamicTypingNodeValue?: boolean;
  /**
   * @default false
   */
  arrayMode?:
    | ((tagName: string, parentTagName: string) => boolean)
    | string
    | boolean
    | RegExp;
  /**
   * @default false
   */
  cdataTagName?: string;
  tagValueProcessor?: (
    value: Uint8Array,
    currentNode: XMLNode,
    tagName?: string,
  ) => string | Uint8Array;
  /**
   * @default  (value:string)=>value
   */
  attributeValueProcessor?: (value: string, attrName: string) => string;
  /**
   * @default []
   */
  stopNodes?: string[];
}
export const defaultOptions: ParseOptions = {
  trimValues: true,
  attributeNamePrefix: '$',
  attributesNodeName: false as unknown as string,
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  dynamicTypingAttributeValue: true,

  textNodeName: '#text',

  dynamicTypingNodeValue: true,
  arrayMode: false,
  cdataTagName: false as unknown as string,
  tagValueProcessor: (value: Uint8Array) => {
    return decoder.decode(value).replace(/\r/g, '');
  },
  attributeValueProcessor: (value: string) => value,
  stopNodes: [],
};

import { XMLNode } from '../XMLNode';

const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array: Uint8Array) => {
    return utf8Decoder.decode(array);
  },
};
export interface ParseOptions {
  /**
   * should we remove ascii < 32
   * @default true
   */
  trimValues?: boolean;
  /**
   * @default '$'
   */
  attributeNamePrefix?: string;
  /**
   * @default '''
   */
  attributesNodeName?: string;
  /**
   * skip attributes
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
   * Parse attribute values that looks like number or boolean
   * @default true
   */
  dynamicTypingAttributeValue?: boolean;
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
   * Parse tag values that looks like number or boolean
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
  /**
   * Tag values can be modified during parsing. By default we decode the tag value (a Uint8Array) using TextDecoder
   */
  tagValueProcessor?: (
    value: Uint8Array,
    currentNode: XMLNode,
    tagName?: string,
  ) => string | Uint8Array;
  /**
   * Attribute values can be modified during parsing
   * @default  (value:string)=>value
   */
  attributeValueProcessor?: (value: string, attrName: string) => string;
  /**
   * prevent further parsing
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

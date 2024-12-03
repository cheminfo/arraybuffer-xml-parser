import { parseString } from 'dynamic-typing';

import type { XMLAttributeValue, XMLNode } from '../XMLNode';

const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array: Uint8Array) => {
    return utf8Decoder.decode(array);
  },
};

export interface StreamParseOptions extends ParseOptions {
  /**
   * What is the maximal size (in bytes) of an entry
   * @default 1e7
   */
  maxEntrySize?: number;
  /**
   * What is the maximal size for the buffer
   * @default 2e8
   */
  maxBufferSize?: number;
}

export type TagValueProcessor = (
  value: Uint8Array,
  currentNode: XMLNode,
) => any;

export interface ParseOptions {
  /**
   * should we remove ascii < 32
   * @default true
   */
  trimValues?: boolean;
  /**
   * @default ''
   */
  attributesNodeName?: string;
  /**
   * Tag values can be modified during parsing. By default we decode the tag value (a Uint8Array) using TextDecoder
   */
  tagValueProcessor?: TagValueProcessor;
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
   * @default '#text'
   */
  textNodeName?: string;
  /**
   * Callback to process tag names
   * @default (name:string) => name
   */
  tagNameProcessor?: (name: string) => string;
  /**
   * Callback to process attribute names
   * @default (name:string) => `$${name}`
   */
  attributeNameProcessor?: (name: string) => string;
  /**
   * @default true
   */
  parseAttributesString?: boolean;
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
   * Attribute values can be modified during parsing
   * @default  (value:string)=>value
   */
  attributeValueProcessor?: (value: string, name: string) => XMLAttributeValue;
  /**
   * prevent further parsing
   * @default []
   */
  stopNodes?: string[];
}

export type RealParseOptions = Required<ParseOptions>;

export type RealStreamParseOptions = Required<StreamParseOptions>;

export const defaultOptions: RealParseOptions = {
  trimValues: true,
  attributesNodeName: '',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseAttributesString: true,

  textNodeName: '#text',

  arrayMode: false,
  cdataTagName: false as unknown as string,
  tagNameProcessor: (name: string) => name,
  attributeNameProcessor: (name: string) => `$${name}`,
  tagValueProcessor: (value: Uint8Array) => {
    const string = decoder.decode(value).replaceAll('\r', '');
    return parseString(string);
  },
  attributeValueProcessor: (value: string) => parseString(value),
  stopNodes: [],
};

export const defaultStreamOptions: RealStreamParseOptions = {
  ...defaultOptions,
  maxEntrySize: 1e7,
  maxBufferSize: 2e8,
};

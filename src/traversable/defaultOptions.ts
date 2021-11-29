import { XMLNode } from '../XMLNode';

const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array: Uint8Array) => {
    return utf8Decoder.decode(array);
  },
};
export interface OptionsType {
  trimValues?: boolean;
  attributeNamePrefix?: string;
  attributesNodeName?: boolean | string;
  ignoreAttributes?: boolean;
  ignoreNameSpace?: boolean;
  allowBooleanAttributes?: boolean;
  dynamicTypingAttributeValue?: boolean;
  tagNameProcessor?: (arg: string) => string;
  textNodeName?: string;
  cdataPositddionChar?: string;
  attributeNameProcessor?: (name: string) => string;
  parseAttributesString?: boolean;
  dynamicTypingNodeValue?: boolean;
  arrayMode?:
    | boolean
    | string
    | ((tagName: string, parentTagName: string) => boolean)
    | RegExp;
  cdataTagName?: boolean | string;
  tagValueProcessor?: (
    value: Uint8Array,
    currentNode: XMLNode,
    tagName?: string,
  ) => string | Uint8Array;
  attributeValueProcessor?: (value: string, attrName: string) => string;
  stopNodes?: string[];
}
export const defaultOptions: OptionsType = {
  trimValues: true,
  attributeNamePrefix: '$',
  attributesNodeName: false,
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  dynamicTypingAttributeValue: true,

  textNodeName: '#text',

  dynamicTypingNodeValue: true,
  arrayMode: false,
  cdataTagName: false,
  tagValueProcessor: (value: Uint8Array) => {
    return decoder.decode(value).replace(/\r/g, '');
  },
  attributeValueProcessor: (value: string) => value,
  stopNodes: [],
};

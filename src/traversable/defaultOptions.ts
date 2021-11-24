import { XMLNode } from "../XMLNode";

const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array:Uint8Array) => {
    return utf8Decoder.decode(array);
  },
};
export interface optionsType{
  trimValues: boolean,
  attributeNamePrefix: string,
  attributesNodeName: boolean,
  ignoreAttributes: boolean,
  ignoreNameSpace: boolean,
  allowBooleanAttributes: boolean,
  dynamicTypingAttributeValue: boolean,
  tagNameProcessor?:string,
  textNodeName: string,

  dynamicTypingNodeValue: boolean,
  arrayMode: boolean,
  cdataTagName: boolean|string,
  tagValueProcessor: (value:Uint8Array, tagName?:string, currentNode?:XMLNode) => string|Uint8Array,
  attributeValueProcessor: (value:string,attrName?:string) => string,
  stopNodes: string[],
}
export const defaultOptions:optionsType = {
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
  tagValueProcessor: (value:Uint8Array) => {
    return decoder.decode(value).replace(/\r/g, '');
  },
  attributeValueProcessor: (value:string) => value,
  stopNodes: [],
};

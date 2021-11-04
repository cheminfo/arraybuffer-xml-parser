import { optionsType } from "..";

/* eslint-disable @typescript-eslint/no-explicit-any */
const utf8Decoder = new TextDecoder();


export const decoder = {
  decode: (array: BufferSource) => {
    return utf8Decoder.decode(array);
  },
};

export const defaultOptions: optionsType = {
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
  tagValueProcessor: (value) => {
    return decoder.decode(value).replace(/\r/g, '');
  },
  attributeValueProcessor: (value) => value,
  stopNodes: [],
};

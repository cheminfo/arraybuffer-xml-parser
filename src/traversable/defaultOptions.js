const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array) => {
    return utf8Decoder.decode(array);
  },
};

export const defaultOptions = {
  attributeNamePrefix: '@_',
  attributesNodeName: false,
  textNodeName: '#text',

  trimValues: true,

  ignoreAttributes: false,
  ignoreNameSpace: false,
  dynamicTypingAttributeValue: true,
  allowBooleanAttributes: false,

  dynamicTypingNodeValue: true,
  arrayMode: false,
  cdataTagName: false,
  cdataPositionChar: '\\c',
  tagValueProcessor: (value) => {
    return decoder.decode(value).replace(/\r/g, '');
  },
  attributeValueProcessor: (value) => value,
  stopNodes: [],
};

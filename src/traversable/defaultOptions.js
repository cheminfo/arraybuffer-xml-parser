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
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,

  //ignoreRootElement : false,
  dynamicTypingNodeValue: true,
  dynamicTypingAttributeValue: false,
  arrayMode: false,
  trimValues: true,
  cdataTagName: false,
  cdataPositionChar: '\\c',
  tagValueProcessor: (value) => {
    return decoder.decode(value).replace(/\r/g, '');
  },
  attributeValueProcessor: (value) => value,
  stopNodes: [],
};

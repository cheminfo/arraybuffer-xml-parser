const utf8Decoder = new TextDecoder();

interface optionsType {
  attributeNamePrefix?: string;
  attributesNodeName?: boolean;
  textNodeName?: string;
  trimValues?: boolean;
  ignoreAttributes?: boolean;
  ignoreNameSpace?: boolean;
  dynamicTypingAttributeValue?: boolean;
  allowBooleanAttributes?: boolean;
  dynamicTypingNodeValue?: boolean;
  arrayMode?: boolean;
  cdataTagName?: boolean;
  tagValueProcessor?: (v: BufferSource, node?: any) => string;
  attributeValueProcessor?: (v: BufferSource) => BufferSource;
  tagNameProcessor?: (v: any) => any;
  attributeNameProcessor?: (v: any) => any;
  stopNodes?: boolean[];
}
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

interface X2jOptions {
  attributeNamePrefix: string;
  attributesNodeName: false | string;
  textNodeName: string;
  ignoreAttributes: boolean;
  ignoreNameSpace: boolean;
  allowBooleanAttributes: boolean;
  dynamicTypingNodeValue: boolean;
  dynamicTypingAttributeValue: boolean;
  arrayMode:
    | boolean
    | 'strict'
    | RegExp
    | ((tagName: string, parentTagName: string) => boolean);
  trimValues: boolean;
  cdataTagName: false | string;
  tagValueProcessor: (tagValue: string, tagName: string) => string;
  attributeValueProcessor: (attrValue: string, attrName: string) => string;
  stopNodes: string[];
}
type X2jOptionsOptional = Partial<X2jOptions>;
interface validationOptions {
  allowBooleanAttributes: boolean;
}
type validationOptionsOptional = Partial<validationOptions>;

type ESchema = string | object | Array<string | object>;

interface ValidationError {
  err: { code: string; msg: string; line: number };
}

export function parse(
  xmlData: string,
  options?: X2jOptionsOptional,
  validationOptions?: validationOptionsOptional | boolean,
): unknown;

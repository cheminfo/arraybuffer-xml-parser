type X2jOptions = {
  attributeNamePrefix: string;
  attrNodeName: false | string;
  textNodeName: string;
  ignoreAttributes: boolean;
  ignoreNameSpace: boolean;
  allowBooleanAttributes: boolean;
  parseNodeValue: boolean;
  parseAttributeValue: boolean;
  arrayMode:
    | boolean
    | 'strict'
    | RegExp
    | ((tagName: string, parentTagName: string) => boolean);
  trimValues: boolean;
  cdataTagName: false | string;
  cdataPositionChar: string;
  tagValueProcessor: (tagValue: string, tagName: string) => string;
  attrValueProcessor: (attrValue: string, attrName: string) => string;
  stopNodes: string[];
};
type X2jOptionsOptional = Partial<X2jOptions>;
type validationOptions = {
  allowBooleanAttributes: boolean;
};
type validationOptionsOptional = Partial<validationOptions>;

type ESchema = string | object | Array<string | object>;

type ValidationError = {
  err: { code: string; msg: string; line: number };
};

export function parse(
  xmlData: string,
  options?: X2jOptionsOptional,
  validationOptions?: validationOptionsOptional | boolean,
): any;

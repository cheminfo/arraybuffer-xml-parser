# xml-buffer-parser

This code is based on the fork of [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser).

The reason is that we wanted to parse large XML files (over 1Gb) and therefore in the current implementation of javascript we could not use a String (limited to 512Mb).

The code was therefore changed in order to use directly an ArrayBuffer.

### Main Features

- Transform XML to JSON or Nimn
- Works with node packages and in browser
- It can handle very big files (tested with files over 1Gb).
- Various options are available to customize the transformation
  - You can parse CDATA as a separate property.
  - You can prefix attributes or group them to a separate property. Or they can be ignored from the result completely.
  - You can parse tag's or attribute's value to primitive type: string, integer, float, hexadecimal, or boolean. And can optionally decode for HTML char.
  - You can remove namespace from tag or attribute name while parsing
  - It supports boolean attributes, if configured.

## How to use

To use it in **NPM package** install it first

`$npm install fast-xml-parser` or using [yarn](https://yarnpkg.com/) `$yarn add fast-xml-parser`

To use it from a **CLI** install it globally with the `-g` option.

`$npm install fast-xml-parser -g`

To use it on a **webpage** include it from a [CDN](https://cdnjs.com/libraries/fast-xml-parser)

### XML to JSON

```js
var jsonObj = parser.parse(xmlData [,options] );
```

```js
const { parse } = require('xml-buffer-parser');

const options = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr', //default is 'false'
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  dynamicTyping: true,
  cdataTagName: '__cdata', //default is 'false'
  cdataPositionChar: '\\c',
  arrayMode: false, //"strict"
  attrValueProcessor: (val, attrName) =>
    he.decode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
  stopNodes: ['parse-me-as-string'],
};

const jsonObj = parse(xmlData, options, true);
```

<details>
	<summary>OPTIONS :</summary>

- **attributeNamePrefix** : prepend given string to attribute name for identification
- **attrNodeName**: (Valid name) Group all the attributes as properties of given name.
- **ignoreAttributes** : Ignore attributes to be parsed.
- **ignoreNameSpace** : Remove namespace string from tag and attribute names.
- **allowBooleanAttributes** : a tag can have attributes without any value
- **parseNodeValue** : Parse the value of text node to float, integer, or boolean.
- **parseAttributeValue** : Parse the value of an attribute to float, integer, or boolean.
- **trimValues** : trim string values of an attribute or node
- **decodeHTMLchar** : This options has been removed from 3.3.4. Instead, use tagValueProcessor, and attrValueProcessor. See above example.
- **cdataTagName** : If specified, parser parse CDATA as nested tag instead of adding it's value to parent tag.
- **cdataPositionChar** : It'll help to covert JSON back to XML without losing CDATA position.
- **arrayMode** : When `false`, a tag with single occurrence is parsed as an object but as an array in case of multiple occurences. When `true`, a tag will be parsed as an array always excluding leaf nodes. When `strict`, all the tags will be parsed as array only. When instance of `RegEx`, only tags will be parsed as array that match the regex. When `function` a tag name is passed to the callback that can be checked.
- **tagValueProcessor** : Process tag value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.
- **attrValueProcessor** : Process attribute value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.
- **stopNodes** : an array of tag names which are not required to be parsed. Instead their values are parsed as string.

</details>

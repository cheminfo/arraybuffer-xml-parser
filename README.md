# arraybuffer-xml-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

This code is based on a copy of [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser).

The reason is that we wanted to parse large XML files (over 1Gb) and the current implementation of fast-xml-parser use as input a string. In the current implementation of javascript in V8 this limits the size to 512Mb.

In this code we parse directly a Uint8Array (or an ArrayBuffer) and the limit is now 4Gb.

## Installation

`$ npm i arraybuffer-xml-parser`

## Usage

### XML to JSON

```js
import { parse } from 'arraybuffer-xml-parser';

// in order to show an example we will encode the data to get the ArrayBuffer.

const encoder = new TextEncoder();
const xmlData = encoder.encode(
  `<rootNode><tag>value</tag><boolean>true</boolean><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>`,
);

const object = parse(xmlData, options);

/*
object = {
  rootNode: {
    tag: 'value',
    boolean: 'true',
    intTag: '045',
    floatTag: '65.34',
  },
}
*/
```

## Options

| Option                      | Description                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| attributeNamePrefix         | prepend given string to attribute name for identification                                                                                                                                                                                                                                                                                                                                                          |
| attributesNodeName          | (Valid name) Group all the attributes as properties of given name.                                                                                                                                                                                                                                                                                                                                                 |
| ignoreAttributes            | Ignore attributes to be parsed.                                                                                                                                                                                                                                                                                                                                                                                    |
| ignoreNameSpace             | Remove namespace string from tag and attribute names.                                                                                                                                                                                                                                                                                                                                                              |
| allowBooleanAttributes      | a tag can have attributes without any value                                                                                                                                                                                                                                                                                                                                                                        |
| dynamicTypingNodeValue      | Parse the value of text node to float, integer, or boolean.                                                                                                                                                                                                                                                                                                                                                        |
| dynamicTypingAttributeValue | Parse the value of an attribute to float, integer, or boolean.                                                                                                                                                                                                                                                                                                                                                     |
| trimValues                  | trim string values of an attribute or node                                                                                                                                                                                                                                                                                                                                                                         |
| cdataTagName                | If specified, parser parse CDATA as nested tag instead of adding it's value to parent tag.                                                                                                                                                                                                                                                                                                                         |
| arrayMode                   | When `false`, a tag with single occurrence is parsed as an object but as an array in case of multiple occurences. When `true`, a tag will be parsed as an array always excluding leaf nodes. When `strict`, all the tags will be parsed as array only. When instance of `RegEx`, only tags will be parsed as array that match the regex. When `function` a tag name is passed to the callback that can be checked. |
| tagValueProcessor           | Process tag value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.                                                                                                                                                                                                                                                                                          |
| attributeValueProcessor     | Process attribute value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.                                                                                                                                                                                                                                                                                    |
| stopNodes                   | an array of tag names which are not required to be parsed. They are kept as Uint8Array.                                                                                                                                                                                                                                                                                                                            |

## [API Documentation](https://cheminfo.github.io/arraybuffer-xml-parser/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/arraybuffer-xml-parser.svg
[npm-url]: https://www.npmjs.com/package/arraybuffer-xml-parser
[ci-image]: https://github.com/cheminfo/arraybuffer-xml-parser/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/arraybuffer-xml-parser/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/arraybuffer-xml-parser.svg
[codecov-url]: https://codecov.io/gh/cheminfo/arraybuffer-xml-parser
[download-image]: https://img.shields.io/npm/dm/arraybuffer-xml-parser.svg
[download-url]: https://www.npmjs.com/package/arraybuffer-xml-parser

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

const object = parse(xmlData);

/*
object = {
  rootNode: {
    tag: 'value',
    boolean: true,
    intTag: 45,
    floatTag: 65.34,
  },
}
*/
```

By default text nodes and attribute values are dynamically typed, so `'true'`
becomes a boolean and `'65.34'` a number. Pass your own `tagValueProcessor` /
`attributeValueProcessor` to keep the raw values.

### Streaming a large XML

`parseStream` takes a web `ReadableStream` and yields one object per occurrence
of `lookupTagName`, so a file larger than the available memory can be processed
entry by entry.

```js
import { open } from 'node:fs/promises';

import { parseStream } from 'arraybuffer-xml-parser';

const file = await open('medline.xml', 'r');

for await (const entry of parseStream(
  file.readableWebStream(),
  'PubmedArticle',
)) {
  console.log(entry);
}
```

## Options

| Option                  | Description                                                                                                                                                                                                                                                                                                                                                                                                        | Default value                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| trimValues              | Remove ascii < 32 around string values of an attribute or node.                                                                                                                                                                                                                                                                                                                                                    | `true`                                          |
| attributesNodeName      | (Valid name) Group all the attributes as properties of given name.                                                                                                                                                                                                                                                                                                                                                 | `''`                                            |
| ignoreAttributes        | Ignore attributes to be parsed.                                                                                                                                                                                                                                                                                                                                                                                    | `false`                                         |
| ignoreNameSpace         | Remove namespace string from tag and attribute names.                                                                                                                                                                                                                                                                                                                                                              | `false`                                         |
| allowBooleanAttributes  | A tag can have attributes without any value.                                                                                                                                                                                                                                                                                                                                                                       | `false`                                         |
| textNodeName            | Name of the property containing text nodes.                                                                                                                                                                                                                                                                                                                                                                        | `'#text'`                                       |
| parseAttributesString   | Parse the attributes of a tag.                                                                                                                                                                                                                                                                                                                                                                                     | `true`                                          |
| cdataTagName            | If specified, parser parse CDATA as nested tag instead of adding it's value to parent tag.                                                                                                                                                                                                                                                                                                                         | `false`                                         |
| arrayMode               | When `false`, a tag with single occurrence is parsed as an object but as an array in case of multiple occurences. When `true`, a tag will be parsed as an array always excluding leaf nodes. When `strict`, all the tags will be parsed as array only. When instance of `RegEx`, only tags will be parsed as array that match the regex. When `function` a tag name is passed to the callback that can be checked. | `false`                                         |
| tagNameProcessor        | Callback to process tag names. Receives the tag name and the matching nodes.                                                                                                                                                                                                                                                                                                                                       | `(name) => name`                                |
| attributeNameProcessor  | Callback to process attribute names.                                                                                                                                                                                                                                                                                                                                                                               | prefix the name with `$`                        |
| tagValueProcessor       | Process tag value during transformation. Like HTML decoding, word capitalization, etc. Receives the raw `Uint8Array` and the current node.                                                                                                                                                                                                                                                                         | decode as UTF-8 and dynamically type the string |
| attributeValueProcessor | Process attribute value during transformation. Like HTML decoding, word capitalization, etc.                                                                                                                                                                                                                                                                                                                       | dynamically type the string                     |
| stopNodes               | An array of tag names which are not required to be parsed. They are kept as Uint8Array.                                                                                                                                                                                                                                                                                                                            | `[]`                                            |

`parseStream` accepts the same options plus:

| Option        | Description                                     | Default value |
| ------------- | ----------------------------------------------- | ------------- |
| maxEntrySize  | Maximal size (in bytes) of a single entry.      | `1e7`         |
| maxBufferSize | Maximal size (in bytes) of the internal buffer. | `2e8`         |

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

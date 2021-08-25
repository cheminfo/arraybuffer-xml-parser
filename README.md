# large-xml-parser

This code is based on the fork of [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser).

The reason is that we wanted to parse large XML files (over 1Gb) and therefore in the current implementation of javascript we could not use a String (limited to 512Mb).

The code was therefore changed in order to use directly an ArrayBuffer.

### Main Features

- Validate XML data syntactically
- Transform XML to JSON or Nimn
- Transform JSON back to XML
- Works with node packages, in browser, and in CLI (press try me button above for demo)
- Faster than any pure JS implementation.
- It can handle big files (tested with files over 1Gb).
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
var parser = require('fast-xml-parser');
var he = require('he');

var options = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr', //default is 'false'
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata', //default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false, //"strict"
  attrValueProcessor: (val, attrName) =>
    he.decode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
  stopNodes: ['parse-me-as-string'],
};

if (parser.validate(xmlData) === true) {
  //optional (it'll return an object in case it's not valid)
  var jsonObj = parser.parse(xmlData, options);
}

// Intermediate obj
var tObj = parser.getTraversalObj(xmlData, options);
var jsonObj = parser.convertToJson(tObj, options);
```

As you can notice in the above code, validator is not embedded with in the parser and expected to be called separately. However, you can pass `true` or validation options as 3rd parameter to the parser to trigger validator internally. It is same as above example.

```js
try {
  var jsonObj = parser.parse(xmlData, options, true);
} catch (error) {
  console.log(error.message);
}
```

Validator returns the following object in case of error;

```js
{
  err: {
    code: code,
    msg: message,
    line: lineNumber,
  },
};
```

#### Note: [he](https://www.npmjs.com/package/he) library is used in this example

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
- **parseTrueNumberOnly**: if true then values like "+123", or "0123" will not be parsed as number.
- **arrayMode** : When `false`, a tag with single occurrence is parsed as an object but as an array in case of multiple occurences. When `true`, a tag will be parsed as an array always excluding leaf nodes. When `strict`, all the tags will be parsed as array only. When instance of `RegEx`, only tags will be parsed as array that match the regex. When `function` a tag name is passed to the callback that can be checked.
- **tagValueProcessor** : Process tag value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.
- **attrValueProcessor** : Process attribute value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.
- **stopNodes** : an array of tag names which are not required to be parsed. Instead their values are parsed as string.

</details>

<details>
	<summary>To use from <b>command line</b></summary>

```bash
$xml2js [-ns|-a|-c|-v|-V] <filename> [-o outputfile.json]
$cat xmlfile.xml | xml2js [-ns|-a|-c|-v|-V] [-o outputfile.json]
```

- -ns : To include namespaces (by default ignored)
- -a : To ignore attributes
- -c : To ignore value conversion (i.e. "-3" will not be converted to number -3)
- -v : validate before parsing
- -V : only validate
</details>

<details>
	<summary>To use it <b>on webpage</b></summary>

```js
var result = parser.validate(xmlData);
if (result !== true) console.log(result.err);
var jsonObj = parser.parse(xmlData);
```

</details>

### JSON / JS Object to XML

```js
var Parser = require('fast-xml-parser').j2xParser;
//default options need not to set
var defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: '@', //default is false
  textNodeName: '#text',
  ignoreAttributes: true,
  cdataTagName: '__cdata', //default is false
  cdataPositionChar: '\\c',
  format: false,
  indentBy: '  ',
  supressEmptyNode: false,
  tagValueProcessor: (a) => he.encode(a, { useNamedReferences: true }), // default is a=>a
  attrValueProcessor: (a) =>
    he.encode(a, { isAttributeValue: isAttribute, useNamedReferences: true }), // default is a=>a
};
var parser = new Parser(defaultOptions);
var xml = parser.parse(json_or_js_obj);
```

<details>
	<summary>OPTIONS :</summary>

With the correct options, you can get the almost original XML without losing any information.

- **attributeNamePrefix** : Identify attributes with this prefix otherwise treat them as a tag.
- **attrNodeName**: Identify attributes when they are grouped under single property.
- **ignoreAttributes** : Don't check for attributes. Treats everything as tag.
- **encodeHTMLchar** : This option has been removed from 3.3.4. Use tagValueProcessor, and attrValueProcessor instead. See above example.
- **cdataTagName** : If specified, parse matching tag as CDATA
- **cdataPositionChar** : Identify the position where CDATA tag should be placed. If it is blank then CDATA will be added in the last of tag's value.
- **format** : If set to true, then format the XML output.
- **indentBy** : indent by this char `when` format is set to `true`
- **supressEmptyNode** : If set to `true`, tags with no value (text or nested tags) are written as self closing tags.
- **tagValueProcessor** : Process tag value during transformation. Like HTML encoding, word capitalization, etc. Applicable in case of string only.
- **attrValueProcessor** : Process attribute value during transformation. Like HTML encoding, word capitalization, etc. Applicable in case of string only.
</details>

## Benchmark

#### XML to JSON

![npm_xml2json_compare](static/img/fxpv3-vs-xml2jsv0419_chart.png)

<details>
	<summary>report</summary>

| file size                      | fxp 3.0 validator (rps) | fxp 3.0 parser (rps) | xml2js 0.4.19 (rps) |
| ------------------------------ | ----------------------- | -------------------- | ------------------- |
| 1.5k                           | 16581.06758             | 14032.09323          | 4615.930805         |
| 1.5m                           | 14918.47793             | 13.23366098          | 5.90682005          |
| 13m                            | 1.834479235             | 1.135582008          | -1                  |
| 1.3k with CDATA                | 30583.35319             | 43160.52342          | 8398.556349         |
| 1.3m with CDATA                | 27.29266471             | 52.68877009          | 7.966000795         |
| 1.6k with cdata,prolog,doctype | 27690.26082             | 41433.98547          | 7872.399268         |
| 98m                            | 0.08473858148           | 0.2600104004         | -1                  |

- -1 indicates error or incorrect output.
</details>

#### JSON to XML

![npm_xml2json_compare](static/img/j2x.png)

<details>
	<summary>report</summary>

| file size | fxp 3.2 js to xml | xml2js 0.4.19 builder |
| --------- | ----------------- | --------------------- |
| 1.3k      | 160148.9801       | 10384.99401           |
| 1.1m      | 173.6374831       | 8.611884025           |

</details>

### Worth to mention

- **[BigBit standard)](https://github.com/amitguptagwl/bigbit)** : A standard to represent any number in the universe in comparatively less space and without precision loss. A standard to save memory to represent any text string in comparision of UTF encodings.
- **[imglab](https://github.com/NaturalIntelligence/imglab)** : Speedup and simplify image labeling / annotation. Supports multiple formats, one click annotation, easy interface and much more. There are more than half million images are being annotated every month using this tool.
- [stubmatic](https://github.com/NaturalIntelligence/Stubmatic) : Create fake webservices, DynamoDB or S3 servers, Manage fake/mock stub data, Or fake any HTTP(s) call.
- **[अनुमार्गक (anumargak)](https://github.com/NaturalIntelligence/anumargak)** : The fastest and simple router for node js web frameworks with many unique features.
- [मुनीम (Muneem)](https://github.com/muneem4node/muneem) : A webframework made for all team members. Fast and Featured.
- [शब्दावली (shabdawali)](https://github.com/amitguptagwl/shabdawali) : Amazing human like typing effects beyond your imagination.

## Contributors

This project exists thanks to [all](graphs/contributors) the people who contribute. [[Contribute](docs/CONTRIBUTING.md)].

<!-- <a href="graphs/contributors"><img src="https://opencollective.com/fast-xml-parser/contributors.svg?width=890&button=false" /></a> -->
<!--
### Lead Maintainers
![Amit Gupta](https://avatars1.githubusercontent.com/u/7692328?s=100&v=4)
[![Vohmyanin Sergey Vasilevich](https://avatars3.githubusercontent.com/u/783335?s=100&v=4)](https://github.com/Delagen)

### All Contributors -->

<a href="graphs/contributors"><img src="https://opencollective.com/fast-xml-parser/contributors.svg?width=890&button=false" /></a>

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/fast-xml-parser#backer)]

<a href="https://opencollective.com/fast-xml-parser#backers" target="_blank"><img src="https://opencollective.com/fast-xml-parser/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/fast-xml-parser#sponsor)]

<a href="https://opencollective.com/fast-xml-parser/sponsor/0/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/1/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/2/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/3/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/4/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/5/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/6/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/7/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/8/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/fast-xml-parser/sponsor/9/website" target="_blank"><img src="https://opencollective.com/fast-xml-parser/sponsor/9/avatar.svg"></a>

# License

- MIT License

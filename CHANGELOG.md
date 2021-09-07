# Changelog

## [0.4.0](https://www.github.com/cheminfo/arraybuffer-xml-parser/compare/v0.3.0...v0.4.0) (2021-09-07)


### Features

* deal with bigint64 ([04a3ae8](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/04a3ae88292d531fe9a36d991fa8fb78a614bc94))

## [0.3.0](https://www.github.com/cheminfo/arraybuffer-xml-parser/compare/v0.2.0...v0.3.0) (2021-09-06)


### ⚠ BREAKING CHANGES

* Only change attribute names when creating JSON
* attributeNamePrefix is by default '$'

### Features

* Only change attribute names when creating JSON ([8a8a3ba](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/8a8a3ba1bcd652be39cc659b42f717627141d9b4))


### Miscellaneous Chores

* attributeNamePrefix is by default '$' ([dc34e74](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/dc34e748d36220000784bdee9e829695e94589a1))

## [0.2.0](https://www.github.com/cheminfo/arraybuffer-xml-parser/compare/v0.1.0...v0.2.0) (2021-09-03)


### Bug Fixes

* publish ([b868fce](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/b868fce371514607ffb19dc577a6db94df817665))

## 0.1.0 (2021-09-03)


### ⚠ BREAKING CHANGES

* rename node.val to node.value
* rename node.attrsMap to node.attributes
* rename node.child to node.children

### Miscellaneous Chores

* rename node.attrsMap to node.attributes ([a630b11](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/a630b11d3627bc8c960e671088267d83472ae9f4))
* rename node.child to node.children ([4501cb4](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/4501cb4835741d2b50a49c7f50cbad1a6d67ef4d))


### Code Refactoring

* rename node.val to node.value ([2b27e37](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/2b27e37fefa80d920b0d255ab4f59f90eee15386))

## 0.1.0 (2021-09-01)


### Features

* add base64 parsing, not implemented yet ([c048349](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/c048349b6de7fdec426da3dc1b6f781919e9cd3a))
* add build script ([ecea33e](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/ecea33e2f865ce370e44a4404fce40599e8a0372))
* add faster utf-8 decoding ([199a3c7](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/199a3c7d0872953f7c904de398fefd8a34aab926))
* add working xml parsing to some extent ([25739b0](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/25739b0ac8ebd7a7f74e7025065b49e8364f13a8))
* Added array space trimming ([5db71a5](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/5db71a52cb7657e1bf004ad7ab854832750f0f7b))
* Added array splitting ([4530e45](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/4530e455cfae31c00f87c2fa2628ef4d96c77794))
* Added numbers parsing, rearranged snippets ([f0a940b](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/f0a940b4596735213a04fa0819e0af1344601acf))
* Added TODOS and adapted some parts to buffers ([e7a7ae1](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/e7a7ae1681d8483df66f1371d17f6ba13977acce))
* **arrayMode:** support RegEx and function in arrayMode option ([#316](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/316)) ([eb8b6c5](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/eb8b6c5ef7e0834fb9b410e60ff15c9257701a62))
* **bundle:** migrate to webpack ([#109](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/109)) ([d4310a0](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/d4310a07ab72a01f7550af52ff7fa22ec9e135fc))
* deal with string (and encode it to array buffer) ([de3a48b](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/de3a48b6daa278f9ee69b15d633c13b0b9edab53))
* implement array value parsing ([fd56c64](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/fd56c64ed84f27ce4e395f0389774492d26e83a7))
* improve speed (but still 2 times slower than fast-xml-parser) ([7826807](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/7826807d92e96cd15d34a05ecf0067534cf24bef))
* use navie decoder in browser ([b4de19f](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/b4de19f5db5204a37c8be2dc171cd7ce153db6e1))


### Bug Fixes

* \r?\n ([a596b64](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/a596b6454d56b9160d7c242621c6cf92c91022ed))
* 126: check for Array type ([38e850e](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/38e850ec3dedc514ce347940d065712dc52f11dd))
* 128 : use 'attrValueProcessor' to process attribute value in json2xml parser ([ce3df9c](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/ce3df9c35be30d0e34661f491164b9afee5365ca))
* 132: "/" should not be parsed as boolean attr in case of self closing tags ([3798a02](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/3798a02bed103e847f3b75356e3d5bf6894a3950))
* 167 [#186](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/186) and [#250](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/250) : '>' is allowed in attr val ([6bc46da](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/6bc46da9f9859cd945b10610ee3a133eed8e9c1c))
* 167: '>' in attribute value ([b46db1b](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/b46db1bd5f5d404374cecaf721c66364e2483a98))
* 170: js to xml parser should work for date values ([3cb3e30](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/3cb3e30ff1c18729429691469420f45ed15561cc))
* 317 : validate nested PI tags ([ec25c54](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/ec25c54932863964a844769563fcca0b6ddc9d46))
* 33: when there is newline char in attr val, it doesn't parse ([30381fa](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/30381fa92e9a954ba7e6880186e65319432db4cc))
* 67 : attrNodeName invalid behavior ([43f0584](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/43f058410bebf037f9adab5654cf61e55d804ce5))
* 73 : IE doesn't support Object.assign ([4a6169d](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/4a6169dd6da9c1b3c12af5eb412349e0428804f7))
* 74: TS2314 compiler error ([e4810bb](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/e4810bb09e956f50669ac31cc741c8df7208cc81))
* 77: parse even if closing tag has space before '>' ([6afa829](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/6afa829a90cd694911abf252ae2ee408149c8b80))
* 80 fix nimn chars ([ba86c4a](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/ba86c4ad5fc90f09d651f28b4471fa14094a1f56))
* 84: Attribute selection logic ([36b4bf9](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/36b4bf951200bdc23da5e705c7c659b95616c307))
* 86: json 2 xml parser : property with null value should be parsed to self closing tag. ([bba9520](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/bba9520e3232cc9de1ae85c9dfd11b6efcc5b092))
* 93: read the text after self closing tag ([e479c05](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/e479c0592e95516ce0e37be6fcd35309fdb8025a))
* 94 : demo to display validation result. ([244c1a9](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/244c1a916a49965232994be7e6439acceee46a79))
* 98 , [#102](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/102) Support hexadecimal and true number parsing ([6f752f5](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/6f752f5c39e97d07cd911ba79042b151ca1a293f))
* add "use strict" to nimndata.js ([a4e21db](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/a4e21db593bad12b18d107b7c35ad466b3bd713a))
* add fs.FileReadSync failsafe, fix comments ([9e76170](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/9e76170e960b538c6b5bf3729d5f115a331f9b5c))
* add modifications to pass multiple test cases ([40db33b](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/40db33bbf7005f88ea26d4f7315f44deed227905))
* add newline handling to array trimming ([c212c63](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/c212c636fe8b4583691aaca2a656d637101b39b5))
* add repeat case for arrayIndexOf, 1 test left ([7b34d78](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/7b34d78038dc86892c012e6fa83891543d3c4b7e))
* add string tag value processing back ([3352d78](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/3352d7810e0c41a00a4d1a77b8abf70c97b98865))
* add support for 4-bytes utf-8 chars ([06b096b](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/06b096b4af1bbe00e19b2349623d15f996d16b4a))
* add support for different newline formats ([660993a](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/660993a47340c038f0c4bd6a7debe4af59908d63))
* add support for parseTrueNumberOnly tag ([71ecd1a](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/71ecd1a63b3ecaa57ddc74f9e1a49e6ed55e311a))
* allow a tag to be separated by \n\t chars ([decf141](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/decf141f9c81c80670d2f3f69fa0b8f0ca7a0b98))
* broken contributing.md link in readme ([#286](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/286)) ([848d07e](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/848d07e7fe2d62799b2c7b604e340d3df700f7e7))
* cdata first test ([e8d92be](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/e8d92be9a516571e8d229fd3de0de8d272ed0e6e))
* change list to index, fix type error ([a4cde87](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/a4cde87cdc11b247ffbd695a8d75c147638eb29f))
* check opening tag having non alpha num char ([4de9d4a](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/4de9d4a97a747b148ef9f8845bad84c8f3840186))
* correct misspelled word ([de52399](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/de5239909f6c3af8e1f042b008f0c877da9b068c))
* don't treat namespaces as attributes when ignoreNamespace enabled ([f19fd77](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/f19fd7718a7f93d9d40e939faee08244b4f360c8))
* don't wrap attributes if only namespace attrs ([7539539](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/75395394099a754aad0dcad0fb91cc0ccb7ef4c5))
* empty attribute should be parsed ([4787f60](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/4787f6025098214efeb60693304897898b272513))
* ensure typedarray in the browser ([b3db5c2](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/b3db5c2a8a8a25dd3523e8fbbbc7ad5fa364a5d3))
* err when a tag is not properly closed ([f0bf79e](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/f0bf79e24475f96c48103bc170838f0a13695e78))
* exclude any whitespace char from tagName ([76e201e](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/76e201e27902387a9007c79607c88422e03b0333))
* fix eslint ([bd93da8](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/bd93da8c7f52dac5d5cf5953cbc3f6d32d5a813a))
* fix functions and create test cases ([7c731da](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/7c731dab63285fb4690e09e7460d054d798f1bb9))
* fix problems with cdata, more tests passing ([48f86c4](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/48f86c4bf6ce63dc42e7440b155e707fb1710298))
* Fix utility functions and made tests for them ([417e690](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/417e6900a10e3134d49cca283808c003d7871c53))
* fixed bufferIndexOf ([ffa0f8c](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/ffa0f8c56fcd9f0159c531a0e6adebcc6c51b185))
* handle CDATA with regx ([c7faee7](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/c7faee75dd7bc5e9ab915cd64ca720cbea847b14))
* Handle val 0 ([b9ddab4](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/b9ddab43baf57bf0094c94f3156687014d3aaa37))
* IE polyfill ([1c4ea5c](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/1c4ea5c1e26df660a70321327b53564aa13b8e17))
* improve compatibility for every newlines ([8831a47](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/8831a47fc172dd5b477c2f8b1d8f88759547a029))
* make parsing work on more cases ([9237726](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/9237726b14b736ef78b9aab81bca2f2f69eb5e93))
* move instructions, 3 failing tests left ([5b3a20f](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/5b3a20f283c45b3d7d3a4683139a219b1c0ec784))
* newline should be replaced with single space ([715b97e](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/715b97e64a1ae3225278003c55a890ab656e6e58))
* **parse:** fix parsing of multiline tag data when xml with no whitespaces between tags ([#289](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/289)) ([396ab96](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/396ab96f8bd1f9953cfeff6c6b630396dd5f045a))
* pass all tests ([220079e](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/220079e3bc34f9228e6a150312e8b6e4e67c4858))
* pass more tests ([8693857](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/8693857acd02f684547c40ca067600c2c5444eb2))
* pass test with cyrillic chars in tags ([9bef8f4](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/9bef8f454551187c6fe1b8a41ff0dc97cf127bb3))
* **performance:** compare with substr faster than several index comparison ([55149f6](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/55149f6d7b295b050d1d416c05e04446fba1a792))
* remove `postinstall` script ([#306](https://www.github.com/cheminfo/arraybuffer-xml-parser/issues/306)) ([8c0f61b](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/8c0f61b7bc801e37139e22bf43c0ce72d52b180e))
* remove decodeHTML char condition ([fe15a1d](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/fe15a1da716efa5498f63dda9c7e9ac9e72fe1c7))
* use byteOffset instead of offset parameter ([d919946](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/d91994661bf33f0403de3f5bcf7358a8ef8a8d41))
* use let insted of const in for loop ([240610f](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/240610fe3fb16f5220ab08b67832cacfba5bb20e))
* use portfinder for run tests, update deps ([b112512](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/b11251299993b2acf91c2043188dce7a27e5abb2))
* validator should return false instead of err when invalid XML ([ca236a0](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/ca236a0ffde582adccb55daa5f88111192344d26))
* when a tag has value along with subtags ([7c6f2a1](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/7c6f2a1f11477613e1525023650ebb95e82c5382))
* When attribute value has equal sign ([5e0877d](https://www.github.com/cheminfo/arraybuffer-xml-parser/commit/5e0877de81feaef786527198b5a7862f79f7301e))

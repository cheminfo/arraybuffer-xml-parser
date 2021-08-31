/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable jest/no-if */
import he from 'he';

import { parse } from '../parse';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
describe('XMLParser', function () {
  it('should decode HTML entities if allowed', function () {
    const xmlData = encoder.encode(
      '<rootNode>       foo&ampbar&apos;        </rootNode>',
    );
    const expected = {
      rootNode: "foo&bar'",
    };
    const result = parse(xmlData, {
      parseNodeValue: false,
      tagValueProcessor: (a) => he.decode(decoder.decode(a)),
    }); //if you really need to work with a string convert it yourself
    expect(result).toStrictEqual(expected);
  });

  it('should decode HTML entities / char', function () {
    const xmlData = encoder.encode(
      `<element id="7" data="foo\r\nbar" bug="foo&ampbar&apos;"/>`,
    );
    const expected = {
      element: {
        id: 7,
        data: 'foo bar',
        bug: "foo&ampbar'",
      },
    };

    let result = parse(xmlData, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
      parseAttributeValue: true,
      attributeValueProcessor: (a) => he.decode(a, { isAttributeValue: true }),
    });

    //console.log(JSON.stringify(result,null,4));
    expect(result).toStrictEqual(expected);

    // result = validator.validate(xmlData);
    // expect(result).toBe(true);
  });

  it('tag value processor should be called with value and tag name', function () {
    const xmlData = encoder.encode(`<?xml version='1.0'?>
        <any_name>
            <person>
                start
                <name1>Jack 1</name1 >
                middle
                <name2>35</name2>
                end
            </person>
        </any_name>`);

    const expected = {
      any_name: {
        person: {
          '#text': 'startmiddleend',
          name1: 'Jack 1',
          name2: 35,
        },
      },
    };

    const resultMap = {};
    const result = parse(xmlData, {
      tagValueProcessor: (val, tagName) => {
        if (typeof tagName === 'object') {
          tagName = decoder.decode(tagName);
        }
        if (resultMap[tagName]) {
          resultMap[tagName].push(val);
        } else {
          resultMap[tagName] = [val];
        }
        return val;
      },
    });
    //console.log(JSON.stringify(result,null,4));
    //console.log(JSON.stringify(resultMap,null,4));
    expect(result).toStrictEqual(expected);
    expect(resultMap).toStrictEqual({
      any_name: [new Uint8Array(), new Uint8Array()],
      person: [
        encoder.encode('start'),
        encoder.encode('middle'),
        encoder.encode('end'),
      ],
      name1: [encoder.encode('Jack 1')],
      name2: [encoder.encode('35')],
    });
  });

  it('result should have no value if tag processor returns nothing', function () {
    const xmlData = encoder.encode(`<?xml version='1.0'?>
        <any_name>
            <person>
                start
                <name1>Jack 1</name1 >
                middle
                <name2>35</name2>
                end
            </person>
        </any_name>`);

    const expected = {
      any_name: {
        person: {
          name1: '',
          name2: '',
        },
      },
    };

    const result = parse(xmlData, {
      tagValueProcessor: (val, tagName) => {},
    });
    //console.log(JSON.stringify(result,null,4));
    expect(result).toStrictEqual(expected);
  });

  it('result should have constant value returned by tag processor', function () {
    const xmlData = encoder.encode(`<?xml version='1.0'?>
        <any_name>
            <person>
                <name1>Jack 1</name1 >
                <name2>35</name2>
            </person>
        </any_name>`);

    const expected = {
      any_name: {
        '#text': 'fxpfxp',
        person: {
          '#text': 'fxpfxpfxp',
          name1: 'fxp',
          name2: 'fxp',
        },
      },
    };

    const result = parse(xmlData, {
      tagValueProcessor: (val, tagName) => {
        return 'fxp';
      },
    });
    //console.log(JSON.stringify(result,null,4));
    expect(result).toStrictEqual(expected);
  });

  it('attribute parser should be called with  atrribute name and value', function () {
    const xmlData = encoder.encode(
      `<element id="7" data="foo bar" bug="foo n bar"/>`,
    );
    const expected = {
      element: {
        id: 7,
        data: 'foo bar',
        bug: 'foo n bar',
      },
    };

    const resultMap = {};

    let result = parse(xmlData, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
      parseAttributeValue: true,
      attributeValueProcessor: (val, attrName) => {
        if (resultMap[attrName]) {
          resultMap[attrName].push(val);
        } else {
          resultMap[attrName] = [val];
        }
        return val;
      },
    });

    //console.log(JSON.stringify(resultMap,null,4));
    expect(result).toStrictEqual(expected);

    expect(resultMap).toStrictEqual({
      id: ['7'],
      data: ['foo bar'],
      bug: ['foo n bar'],
    });
  });
});

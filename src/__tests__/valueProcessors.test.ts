/* eslint-disable camelcase */
/* eslint-disable no-tabs */
import he from 'he';

import { parse } from '../parse';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

describe('XMLParser', () => {
  it('should decode HTML entities if allowed', () => {
    const xmlData = encoder.encode(
      '<rootNode>       foo&ampbar&apos;        </rootNode>',
    );
    const expected = {
      rootNode: "foo&bar'",
    };
    const result = parse(xmlData, {
      dynamicTypingNodeValue: false,
      tagValueProcessor: (a) => he.decode(decoder.decode(a)),
    }); //if you really need to work with a string convert it yourself
    expect(result).toStrictEqual(expected);
  });

  it('should decode HTML entities / char', () => {
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
      dynamicTypingAttributeValue: true,
      attributeValueProcessor: (a) => he.decode(a, { isAttributeValue: true }),
    });

    expect(result).toStrictEqual(expected);
  });

  it('tag value processor should be called with value, tag name and node', () => {
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

    const result = parse(xmlData, {
      tagValueProcessor: (value) => {
        return value;
      },
    });

    expect(result).toStrictEqual({
      any_name: {
        person: {
          '#text': encoder.encode('startmiddleend'),
          name1: encoder.encode('Jack 1'),
          name2: encoder.encode('35'),
        },
      },
    });
  });

  it('tag value processor should be called with value and node', () => {
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

    const resultMap: Record<string, Uint8Array[]> = {};
    parse(xmlData, {
      tagValueProcessor: (value, node) => {
        if (resultMap[node.tagName]) {
          resultMap[node.tagName].push(value);
        } else {
          resultMap[node.tagName] = [value];
        }
        return value;
      },
    });
    expect(resultMap).toStrictEqual({
      any_name: [new Uint8Array()],
      person: [encoder.encode('startmiddleend')],
      name1: [encoder.encode('Jack 1')],
      name2: [encoder.encode('35')],
    });
  });

  it('result should have no value if tag processor returns nothing', () => {
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
      tagValueProcessor: () => '',
    });

    expect(result).toStrictEqual(expected);
  });

  it('result should have constant value returned by tag processor', () => {
    const xmlData = encoder.encode(`<?xml version='1.0'?>
        <any_name>
            <person>
                <name1>Jack 1</name1 >
                <name2>35</name2>
            </person>
        </any_name>`);

    const expected = {
      any_name: {
        '#text': 'fxp',
        person: {
          '#text': 'fxp',
          name1: 'fxp',
          name2: 'fxp',
        },
      },
    };

    const result = parse(xmlData, {
      tagValueProcessor: () => {
        return 'fxp';
      },
    });

    expect(result).toStrictEqual(expected);
  });

  it('attribute parser should be called with  atrribute name and value', () => {
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

    const resultMap: Record<string, string[]> = {};

    let result = parse(xmlData, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
      dynamicTypingAttributeValue: true,
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

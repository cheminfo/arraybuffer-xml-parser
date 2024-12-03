import { describe, it, expect } from 'vitest';

import { parse } from '../parse';

const encoder = new TextEncoder();
describe('XMLParser', () => {
  it("should parse attributes having '>' in value", () => {
    const xmlData =
      encoder.encode(`<? xml version = "1.0" encoding = "UTF - 8" ?>
        <testStep type="restrequest" name="test step name (bankId -> Error)" id="90e453d3-30cd-4958-a3be-61ecfe7a7cbe">
              <settings/>
              <encoding>UTF-8</encoding>
        </testStep>`);

    const expected = {
      testStep: {
        type: 'restrequest',
        name: 'test step name (bankId -> Error)',
        id: '90e453d3-30cd-4958-a3be-61ecfe7a7cbe',
        settings: '',
        // eslint-disable-next-line unicorn/text-encoding-identifier-case
        encoding: 'UTF-8',
      },
    };

    const result = parse(xmlData, {
      attributeNameProcessor: (name) => name,

      //dynamicTypingAttributeValue: true
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse attributes with valid names', () => {
    const xmlData = encoder.encode(`
        <a>
            <bug atr="sasa" boolean>val
                <b/>
                <br/>
                <br b/>
                <c>some<!--single line comment--></c>here
            </bug>as well
        </a>`);

    const expected = {
      a: {
        '#text': 'as well',
        bug: {
          '#text': 'valhere',
          $atr: 'sasa',
          $boolean: true,
          b: '',
          br: [
            '',
            {
              $b: true,
            },
          ],
          c: 'some',
        },
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse attributes with correct names 2', () => {
    const xmlData =
      encoder.encode(`<a:root xmlns:a="urn:none" xmlns:a-b="urn:none">
        <a:a attr="2foo&ampbar&apos;">1</a:a>
        <a:b>2</a:b>
        <a-b:b-a>2</a-b:b-a>
        <a:c>test&amp;\r\nтест&lt;\r\ntest</a:c>
        <a:el><![CDATA[<a>&lt;<a/>&lt;b&gt;2</b>]]]]>\r\n<![CDATA[]]]]><![CDATA[>&amp;]]>a</a:el>
        <c:string lang="ru">\
    &#x441;&#x442;&#x440;&#x430;&#x445;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x44f;\
    » &#x43e;&#x442; &#x441;&#x443;&#x43c;&#x43c;&#x44b; \
    &#x435;&#x433;&#x43e; &#x430;&#x43a;&#x442;&#x438;&#x432;&#x43e;&#x432;\
    </c:string>
    </a:root>`);
    const expected = {
      'a:root': {
        '$xmlns:a': 'urn:none',
        '$xmlns:a-b': 'urn:none',
        'a:a': {
          '#text': 1,
          $attr: '2foo&ampbar&apos;',
        },
        'a:b': 2,
        'a-b:b-a': 2,
        'a:c': 'test&amp;\nтест&lt;\ntest',
        'a:el': '<a>&lt;<a/>&lt;b&gt;2</b>]]]]>&amp;a',
        'c:string': {
          '#text':
            '&#x441;&#x442;&#x440;&#x430;&#x445;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x44f;    » &#x43e;&#x442; &#x441;&#x443;&#x43c;&#x43c;&#x44b;     &#x435;&#x433;&#x43e; &#x430;&#x43a;&#x442;&#x438;&#x432;&#x43e;&#x432;',
          $lang: 'ru',
        },
      },
    };
    const result = parse(xmlData, {
      allowBooleanAttributes: true,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse tagName without whitespace chars', () => {
    const xmlData = encoder.encode(`<a:root
         attr='df'>val
    </a:root>`);

    const expected = {
      'a:root': {
        $attr: 'df',
        '#text': 'val',
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse XML with DOCTYPE without internal DTD', () => {
    const xmlData = encoder.encode(
      '<?xml version=\'1.0\' standalone=\'no\'?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" ><svg><metadata>test</metadata></svg>',
    );
    const expected = {
      svg: {
        metadata: 'test',
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
    });
    expect(result).toStrictEqual(expected);
  });

  it('should parse XML with DOCTYPE without internal DTD', () => {
    const xmlData = encoder.encode(`<?xml version='1.0' standalone='no'?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
        <svg>
            <metadata>[test]</metadata>
        </svg>`);
    const expected = {
      svg: {
        metadata: '[test]',
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
    });
    expect(result).toStrictEqual(expected);
  });

  it('should parse XML when namespaced ignored', () => {
    const xmlData = encoder.encode(
      `<a:b>c</a:b><a:d/><a:e atr="sasa" boolean>`,
    );
    const expected = {
      b: 'c',
      d: '',
      e: {
        $atr: 'sasa',
        $boolean: true,
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
      ignoreNameSpace: true,
    });
    expect(result).toStrictEqual(expected);
  });

  it('should parse XML with undefined as text', () => {
    const xmlData = encoder.encode(
      `<tag><![CDATA[undefined]]><nested>undefined</nested></tag>`,
    );
    const expected = {
      tag: {
        '#text': 'undefined',
        nested: 'undefined',
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
    });
    expect(result).toStrictEqual(expected);
  });

  it(String.raw`should trim \t or \n chars`, () => {
    const xmlData = encoder.encode(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<MPD\n' +
        '\tavailabilityStartTime="2020-02-16T10:52:03.119Z"\n' +
        '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n' +
        '\t<Period\n' +
        '\t\tid="1578477220">\n' +
        '\t</Period>\n' +
        '</MPD>',
    );
    const expected = {
      MPD: {
        $: {
          availabilityStartTime: '2020-02-16T10:52:03.119Z',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        },
        Period: {
          $: {
            id: 1578477220,
          },
        },
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
      attributesNodeName: '$',
      attributeNameProcessor: (name) => name,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should error for when any tag is left to close', () => {
    const xmlData = encoder.encode(`<?xml version="1.0"?><tag></tag`);
    expect(() => {
      parse(xmlData);
    }).toThrow('Closing Tag is not closed.');
  });
  it('should error for when any tag is left to close', () => {
    const xmlData = encoder.encode(`<?xml version="1.0"?><!-- bad `);
    expect(() => {
      parse(xmlData);
    }).toThrow('Comment is not closed.');
  });
  it('should error for when any tag is left to close', () => {
    const xmlData = encoder.encode(`<?xml version="1.0"?><![CDATA ]`);
    expect(() => {
      parse(xmlData);
    }).toThrow('CDATA is not closed.');
  });
  it('should error for when any tag is left to close', () => {
    const xmlData = encoder.encode(`<?xml version="1.0"?><!DOCTYPE `);
    expect(() => {
      parse(xmlData);
    }).toThrow('DOCTYPE is not closed.');
  });
  it('should error for when any tag is left to close', () => {
    const xmlData = encoder.encode(`<?xml version="1.0"?><?pi  `);
    expect(() => {
      parse(xmlData);
    }).toThrow('Pi Tag is not closed.');
  });

  it('should parse XML when there is a space after tagName', () => {
    const xmlData = encoder.encode(
      `<tag ><![CDATA[undefined]]><nested>undefined</nested></tag>`,
    );
    const expected = {
      tag: {
        '#text': 'undefined',
        nested: 'undefined',
      },
    };

    const result = parse(xmlData, {
      allowBooleanAttributes: true,
    });
    expect(result).toStrictEqual(expected);
  });
});

import { readFileSync } from 'fs';
import { join } from 'path';

import { parse } from '../parse';

const encoder = new TextEncoder();

describe('XMLParser', () => {
  it('should parse multiline tag value when tags without spaces', () => {
    const xmlData = encoder.encode(`<?xml version='1.0'?><root><person>lastname
firstname
patronymic</person></root>`);
    let result = parse(xmlData, {
      ignoreAttributes: false,
    });

    const expected = {
      root: {
        person: 'lastname\nfirstname\npatronymic',
      },
    };
    expect(result).toStrictEqual(expected);
  });
  it('should parse tag having CDATA', () => {
    const xmlData = encoder.encode(`<?xml version='1.0'?>
<any_name>
    <person>
        <phone>+122233344550</phone>
        <name><![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></name>
        <name><![CDATA[<some>Mohan</some>]]></name>
        <blank><![CDATA[]]></blank>
        <regx><![CDATA[^[ ].*$]]></regx>
        <phone>+122233344551</phone>
    </person>
</any_name>`);

    const expected = {
      // eslint-disable-next-line camelcase
      any_name: {
        person: {
          phone: [122233344550, 122233344551],
          name: [`<some>Jack</some>Jack`, `<some>Mohan</some>`],
          blank: '',
          regx: '^[ ].*$',
        },
      },
    };
    let result = parse(xmlData, {
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse tag having CDATA 2', () => {
    const xmlData = encoder.encode(`\
<sql-queries>
    <sql-query id='testquery'><![CDATA[select * from search_urls]]></sql-query>
    <sql-query id='searchinfo'><![CDATA[select * from search_urls where search_urls=?]]></sql-query>
    <sql-query id='searchurls'><![CDATA[select search_url from search_urls ]]></sql-query>
</sql-queries>`);
    const expected = {
      'sql-queries': {
        'sql-query': [
          {
            '@_id': 'testquery',
            '#text': 'select * from search_urls',
          },
          {
            '@_id': 'searchinfo',
            '#text': 'select * from search_urls where search_urls=?',
          },
          {
            '@_id': 'searchurls',
            '#text': 'select search_url from search_urls ',
          },
        ],
      },
    };

    let result = parse(xmlData, {
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);

    //    result = validator.validate(xmlData);
    //    expect(result).toBe(true);
  });

  it('should parse tag having whitespaces before / after CDATA', () => {
    const xmlData = encoder.encode(`\
<xml>
    <a>text</a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>    </c>
    <d><![CDATA[text]]></d>
</xml>`);
    const expected = {
      xml: {
        a: 'text',
        b: 'text',
        c: 'text',
        d: 'text',
      },
    };

    let result = parse(xmlData, {
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);

    //    result = validator.validate(xmlData);
    //    expect(result).toBe(true);
  });

  it('should ignore comment', () => {
    const xmlData = encoder.encode(
      `<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>`,
    );

    const expected = {
      rootNode: {
        tag: [1, 'val'],
      },
    };

    let result = parse(xmlData, {
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);

    //    result = validator.validate(xmlData);
    //    expect(result).toBe(true);
  });

  it('should ignore multiline comments', () => {
    const xmlData = encoder.encode(
      '<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>',
    );

    const expected = {
      rootNode: {
        tag: [1, 'val'],
      },
    };

    let result = parse(xmlData, {
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);

    //    result = validator.validate(xmlData);
    //    expect(result).toBe(true);
  });

  it('should parse tag having text before / after CDATA', () => {
    const xmlData = encoder.encode(`\
<xml>
    <a>text</a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>after    </c>
    <d>before<![CDATA[text]]>   after  t</d>
</xml>`);
    const expected = {
      xml: {
        a: 'text',
        b: 'text',
        c: 'textafter',
        d: 'beforetextafter  t',
      },
    };

    const result = parse(xmlData, {
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should not parse tag value if having CDATA', () => {
    const xmlData = encoder.encode(`\
<xml>
    <a>text</a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>after    </c>
    <d>23<![CDATA[]]>   24</d>
</xml>`);
    const expected = {
      xml: {
        a: 'text',
        b: 'text',
        c: 'textafter',
        d: 2324,
      },
    };

    const result = parse(xmlData, {
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse CDATA as separate tag', () => {
    const xmlData = encoder.encode(`\
<xml>
    <a><![CDATA[text]]></a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>after    </c>
    <d>23<![CDATA[]]>   24</d>
</xml>`);
    const expected = {
      xml: {
        a: {
          __cdata: 'text',
        },
        b: 'text',
        c: {
          '#text': 'after',
          __cdata: 'text',
        },
        d: {
          '#text': 2324,
          __cdata: '',
        },
      },
    };

    const result = parse(xmlData, {
      ignoreAttributes: false,
      cdataTagName: '__cdata',
      cdataPositddionChar: '',
    });

    expect(result).toStrictEqual(expected);
  });

  it('should validate XML with repeated multiline CDATA and comments', () => {
    const fileNamePath = join(__dirname, 'assets/mixed.xml');
    const xmlData = readFileSync(fileNamePath);
    const expected = {
      'ns:root': {
        ptag: [
          {
            nestedtag: 'nesteddata',
            '@_attr': 'val',
            '@_boolean': true,
            '#text': 'some dataafter',
          },
          'before text\n        <nestedtag>\n            nested cdata 1<!--single line comment-->\n        </nestedtag>\n    middle\n        <nestedtag>\n            nested cdata 2<!--multi line\n             comment-->\n        </nestedtag>\n    after\n        <nestedtag>\n            nested cdata 3\n        </nestedtag>\n    end',
        ],
        '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      },
    };

    const result = parse(xmlData, {
      ignoreAttributes: false,
      allowBooleanAttributes: true,
    });

    expect(result).toStrictEqual(expected);
  });
});

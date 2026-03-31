import { describe, expect, it } from 'vitest';

import { parse } from '../parse.ts';

const encoder = new TextEncoder();

describe('XMLParser array with extended prototype props', () => {
  it('should parse all the tags as an array no matter how many occurences excluding premitive values when arrayMode is set to true', () => {
    const xmlData = encoder.encode(`<a>
                       <b>0</b>
                       <b>1</b>
                     </a>`);

    const expected = {
      a: { b: [0, 1] },
    };

    (Array.prototype as any).someExtentionOfArrayPrototype =
      'someExtentionOfArrayPrototype';

    const result = parse(xmlData, {
      arrayMode: false,
      ignoreAttributes: false,
    });

    //console.log(JSON.stringify(result, null, 4));
    expect(result).toStrictEqual(expected);
  });
});

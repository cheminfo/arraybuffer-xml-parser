import { parse } from '../parse.ts';

const encoder = new TextEncoder();

describe('XMLParser array with extended prototype props', () => {
  it('should parse all the tags as an array no matter how many occurences excluding premitive values when arrayMode is set to true', async () => {
    const xmlData = encoder.encode(`<a>
                       <b>0</b>
                       <b>1</b>
                     </a>`);

    const expected = {
      a: { b: [0, 1] },
    };

    // eslint-disable-next-line no-extend-native
    Array.prototype.someExtentionOfArrayPrototype =
      'someExtentionOfArrayPrototype';

    const result = await parse(xmlData, {
      arrayMode: false,
      ignoreAttributes: false,
    });
    //console.log(JSON.stringify(result, null, 4));
    expect(result).toStrictEqual(expected);
  });
});

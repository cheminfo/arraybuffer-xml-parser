import { parse } from '../parse';

describe('XMLParser', function () {
  it('Try to parse a very simple example', function () {
    const xmlData = `
 	<AAA>
	    12345<AB/>678
        </AAA>`;

    const expected = {
      AAA: {
        aaa: '123',
        ABC: '',
      },
    };

    let result = parse(xmlData, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
      //parseAttributeValue: true
    });

    //console.log(JSON.stringify(result,null,4));
    // expect(result).toEqual(expected);

    // result = validator.validate(xmlData);
    // expect(result).toBe(true);
  });
});

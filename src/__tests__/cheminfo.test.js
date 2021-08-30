/* eslint-disable no-tabs */

import { parse } from '../parse';

describe('XMLParser', function () {
  it('Try to parse a very simple example', function () {
    const xmlData = `
 	<AAA>
	    12345<AB/>678
        </AAA>`;

    const expected = { AAA: { '#text': '12345678', AB: '' } };

    let result = parse(xmlData, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);
  });
});

/* eslint-disable no-tabs */

import { parse } from '../parse';

describe('XMLParser', () => {
  it('Try to parse a very simple example', async () => {
    const xmlData = `
 	<AAA>
	    12345<AB/>678
        </AAA>`;

    const expected = { AAA: { '#text': 12345678, AB: '' } };

    let result = await parse(xmlData, {});

    expect(result).toStrictEqual(expected);
  });
});

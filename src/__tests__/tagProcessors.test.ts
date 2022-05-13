/* eslint-disable no-tabs */

import { parse } from '../parse';

describe('XMLParser', () => {
  it('tag name processor', async () => {
    const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                end
            </person>
        </any_name>`;

    const result = await parse(xmlData, {
      tagNameProcessor: (name) => name.toUpperCase(),
    });
    expect(result).toStrictEqual({ ANY_NAME: { PERSON: 'end' } });
  });

  it('attribute name processor', async () => {
    const xmlData = `<?xml version='1.0'?>
	    <ab param1="abc" param2="def">
	    </ab>`;

    const result = await parse(xmlData, {
      attributeNameProcessor: (name: string) => name.toUpperCase(),
    });
    expect(result).toStrictEqual({ ab: { $PARAM1: 'abc', $PARAM2: 'def' } });
  });
});

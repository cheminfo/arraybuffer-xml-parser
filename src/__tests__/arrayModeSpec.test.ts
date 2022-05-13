import { parse } from '../parse';

const encoder = new TextEncoder();

describe('XMLParser with arrayMode enabled', () => {
  it('should parse all the tags as an array no matter how many occurrences excluding primitive values when arrayMode is set to true', async () => {
    const xmlData = encoder.encode(`<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">
                    <name>Banana</name>
                    <count>200</count>
                </item>
                <item grade="B">
                    <name>Apple</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
        <store>
            <region>EU</region>
            <inventory>
                <item>
                    <name>Banana</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
    </report>`);

    const expected = {
      report: [
        {
          store: [
            {
              region: 'US',
              inventory: [
                {
                  item: [
                    {
                      $grade: 'A',
                      name: 'Banana',
                      count: 200,
                    },
                    {
                      $grade: 'B',
                      name: 'Apple',
                      count: 100,
                    },
                  ],
                },
              ],
            },
            {
              region: 'EU',
              inventory: [
                {
                  item: [
                    {
                      name: 'Banana',
                      count: 100,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await parse(xmlData, {
      arrayMode: true,
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse all the tags as an array no matter how many occurrences when arrayMode is set to strict', async () => {
    const xmlData = encoder.encode(`<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">
                    <name>Banana</name>
                    <count>200</count>
                </item>
                <item grade="B">
                    <name>Apple</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
        <store>
            <region>EU</region>
            <inventory>
                <item>
                    <name>Banana</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
    </report>`);

    const expected = {
      report: [
        {
          store: [
            {
              region: ['US'],
              inventory: [
                {
                  item: [
                    {
                      $grade: ['A'],
                      name: ['Banana'],
                      count: [200],
                    },
                    {
                      $grade: ['B'],
                      name: ['Apple'],
                      count: [100],
                    },
                  ],
                },
              ],
            },
            {
              region: ['EU'],
              inventory: [
                {
                  item: [
                    {
                      name: ['Banana'],
                      count: [100],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await parse(xmlData, {
      arrayMode: 'strict',
      ignoreAttributes: false,
    });

    expect(result).toStrictEqual(expected);
  });

  it('should parse all the tags as an array that match arrayMode RegEx or return true as callback', async () => {
    const xmlData = encoder.encode(`<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">
                    <name>Banana</name>
                    <count>200</count>
                </item>
                <item grade="B">
                    <name>Apple</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
        <store>
            <region>EU</region>
            <inventory>
                <item>
                    <name>Banana</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
    </report>`);

    const expected = {
      report: {
        store: [
          {
            region: 'US',
            inventory: [
              {
                item: [
                  {
                    $grade: 'A',
                    name: 'Banana',
                    count: 200,
                  },
                  {
                    $grade: 'B',
                    name: 'Apple',
                    count: 100,
                  },
                ],
              },
            ],
          },
          {
            region: 'EU',
            inventory: [
              {
                item: [
                  {
                    name: 'Banana',
                    count: 100,
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    const regExResult = await parse(xmlData, {
      arrayMode: /inventory|item/,
      ignoreAttributes: false,
    });
    expect(regExResult).toStrictEqual(expected);

    const cbExResult = await parse(xmlData, {
      arrayMode: (tagName) => {
        return ['inventory', 'item'].includes(tagName);
      },
      ignoreAttributes: false,
    });
    expect(cbExResult).toStrictEqual(expected);
  });

  it('should parse all the tags as an array that match arrayMode callback with parent tag', async () => {
    const xmlData = encoder.encode(`<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">
                    <name>Banana</name>
                    <count>200</count>
                </item>
                <item grade="B">
                    <name>Apple</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
        <store>
            <region>EU</region>
            <inventory>
                <item>
                    <name>Banana</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
    </report>`);

    const expected = {
      report: {
        store: [
          {
            region: 'US',
            inventory: {
              item: [
                {
                  $grade: 'A',
                  name: 'Banana',
                  count: 200,
                },
                {
                  $grade: 'B',
                  name: 'Apple',
                  count: 100,
                },
              ],
            },
          },
          {
            region: 'EU',
            inventory: {
              item: [
                {
                  name: 'Banana',
                  count: 100,
                },
              ],
            },
          },
        ],
      },
    };

    const cbExResult = await parse(xmlData, {
      arrayMode: (tagName: string, parentTagName: string) => {
        return parentTagName === 'inventory';
      },
      ignoreAttributes: false,
    });

    expect(cbExResult).toStrictEqual(expected);
  });
});

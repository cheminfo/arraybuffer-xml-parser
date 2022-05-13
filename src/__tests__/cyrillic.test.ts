import { parse } from '../parse';

describe('XMLParser', () => {
  it('should parse XML with cyrillic characters to JSON string', async () => {
    const xmlData = `<КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>`;
    const expected = {
      КорневаяЗапись: {
        Тэг: 'ЗначениеValue53456',
      },
    };
    const options = {
      attributeNamePrefix: '@_',
    };

    const result = await parse(xmlData, options);
    expect(result).toStrictEqual(expected);
    // console.log({ expected})
    // console.log({ result })
  });
});

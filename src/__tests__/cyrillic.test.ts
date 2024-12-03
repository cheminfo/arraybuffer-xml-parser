import { describe, it, expect } from 'vitest';

import { parse } from '../parse';

describe('XMLParser', () => {
  it('should parse XML with cyrillic characters to JSON string', () => {
    const xmlData = `<КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>`;
    const expected = {
      КорневаяЗапись: {
        Тэг: 'ЗначениеValue53456',
      },
    };
    const options = {
      attributeNameProcessor: (name: string) => `@_${name}`,
    };

    const result = parse(xmlData, options);
    expect(result).toStrictEqual(expected);
  });
});

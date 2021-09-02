import { closingIndexForOpeningTag } from '../closingIndexForOpeningTag';

test('sclosingIndexForOpeningTag', () => {
  expect(
    closingIndexForOpeningTag(
      new Uint8Array([0x31, 0x32, 0x33, 0x34, 0x3e]),
      0,
    ),
  ).toStrictEqual({ data: '1234', index: 4 });
});

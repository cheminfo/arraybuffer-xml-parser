import { arrayTrim } from '../arrayTrim';

test('arrayTrim', () => {
  const beginning = new Uint8Array([32, 32, 32, 32, 32, 32, 32, 33, 33, 97]);
  expect(arrayTrim(beginning)).toStrictEqual(new Uint8Array([33, 33, 97]));
  const end = new Uint8Array([33, 33, 97, 32, 32, 32, 32, 32, 32]);
  expect(arrayTrim(end)).toStrictEqual(new Uint8Array([33, 33, 97]));
  const both = new Uint8Array([
    32, 32, 32, 32, 32, 32, 32, 33, 33, 97, 32, 32, 32, 32, 32, 32,
  ]);
  expect(arrayTrim(both)).toStrictEqual(new Uint8Array([33, 33, 97]));
  const emptiness = new Uint8Array([
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x0a,
  ]);
  expect(arrayTrim(emptiness)).toStrictEqual(new Uint8Array([]));
});

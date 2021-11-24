import { defaultOptions } from '../defaultOptions';
import { processTagValue } from '../processTagValue';

test('processTagValue', () => {
  expect(
    processTagValue(new Uint8Array([0x74, 0x72, 0x75, 0x65]), defaultOptions),
  ).toBe(true);
  expect(
    processTagValue(new Uint8Array([0x31, 0x32, 0x33, 0x34]), defaultOptions),
  ).toBe(1234);
  expect(
    processTagValue(
      new Uint8Array([0x66, 0x61, 0x6c, 0x73, 0x65]),
      defaultOptions,
    ),
  ).toBe(false);
  expect(
    processTagValue(new Uint8Array([0x31, 0x2e, 0x33, 0x34]), defaultOptions),
  ).toBe(1.34);
  expect(
    processTagValue(new Uint8Array([0x30, 0x78, 0x61, 0x32]), defaultOptions),
  ).toBe(0xa2);
  expect(
    processTagValue(
      new Uint8Array([
        0x20, 0x73, 0x6f, 0x6d, 0x65, 0x20, 0x76, 0x61, 0x6c, 0x20,
      ]),
      { ...defaultOptions, ...{ trimValues: false } },
    ),
  ).toBe(' some val ');
});

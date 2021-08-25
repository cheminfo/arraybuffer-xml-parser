const {
  parseValue,
  closingIndexForOpeningTag,
} = require('../xmlbuffer2xmlnode');

describe('parseValue', function () {
  it('should parse the value of a tag', function () {
    expect(
      parseValue(new Uint8Array([0x74, 0x72, 0x75, 0x65]), true),
    ).toStrictEqual(true);
    expect(
      parseValue(new Uint8Array([0x31, 0x32, 0x33, 0x34]), true),
    ).toStrictEqual(1234);
    expect(
      parseValue(new Uint8Array([0x66, 0x61, 0x6c, 0x73, 0x65]), true),
    ).toStrictEqual(false);
    expect(
      parseValue(new Uint8Array([0x31, 0x2e, 0x33, 0x34]), true),
    ).toStrictEqual(1.34);
    expect(
      parseValue(new Uint8Array([0x30, 0x78, 0x61, 0x32]), true),
    ).toStrictEqual(0xa2);
    expect(
      parseValue(
        new Uint8Array([
          0x20, 0x73, 0x6f, 0x6d, 0x65, 0x20, 0x76, 0x61, 0x6c, 0x20,
        ]),
      ),
    ).toStrictEqual(' some val ');
  });
  it('should find a tag before the greater than sign', function () {
    expect(
      closingIndexForOpeningTag(
        new Uint8Array([0x31, 0x32, 0x33, 0x34, 0x3e]),
        0,
      ),
    ).toStrictEqual({ data: '1234', index: 4 });
  });
});

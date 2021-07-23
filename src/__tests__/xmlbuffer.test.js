const parser = require('../parser');

const xml = parser.xml2node;

describe('parseValue', function () {
  it('should parse the value of a tag', function () {
    expect(
      xml.parseValue(new Uint8Array([0x74, 0x72, 0x75, 0x65]), true),
    ).toStrictEqual(true);
    expect(
      xml.parseValue(new Uint8Array([0x31, 0x32, 0x33, 0x34]), true),
    ).toStrictEqual(1234);
    expect(
      xml.parseValue(new Uint8Array([0x66, 0x61, 0x6c, 0x73, 0x65]), true),
    ).toStrictEqual(false);
    expect(
      xml.parseValue(new Uint8Array([0x31, 0x2e, 0x33, 0x34]), true),
    ).toStrictEqual(1.34);
  });
});

describe('resolveNameSpace', function () {
  it('should process a namespace', function () {
    expect(
      xml.resolveNameSpace(
        new Uint8Array([0x61, 0x6d, 0x6f, 0x2f, 0x67, 0x75, 0x73]), //amo:gus
        { ignoreNameSpace: true },
      ),
    ).toStrictEqual('amo/gus');
    expect(
      xml.resolveNameSpace(
        new Uint8Array([0x78, 0x6d, 0x6c, 0x6e, 0x73]), //xmlns
        { ignoreNameSpace: true },
      ),
    ).toStrictEqual('');
  });
});

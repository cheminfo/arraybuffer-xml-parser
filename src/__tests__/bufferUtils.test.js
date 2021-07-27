const bufferUtils = require('../bufferUtils');

describe('arrayTrim', function () {
  it('should remove all spaces at beginning and end', function () {
    const beginning = new Uint8Array([32, 32, 32, 32, 32, 32, 32, 33, 33, 97]);
    expect(bufferUtils.arrayTrim(beginning)).toStrictEqual(
      new Uint8Array([33, 33, 97]),
    );
    const end = new Uint8Array([33, 33, 97, 32, 32, 32, 32, 32, 32]);
    expect(bufferUtils.arrayTrim(end)).toStrictEqual(
      new Uint8Array([33, 33, 97]),
    );
    const both = new Uint8Array([
      32, 32, 32, 32, 32, 32, 32, 33, 33, 97, 32, 32, 32, 32, 32, 32,
    ]);
    expect(bufferUtils.arrayTrim(both)).toStrictEqual(
      new Uint8Array([33, 33, 97]),
    );
  });
});
describe('arrayIndexOf', function () {
  it('should find the index pointing to the begining of the found string in array', function () {
    const whole = new Uint8Array([0x61, 0x6d, 0x6f, 0x67, 0x75, 0x73]);
    const sandwiched = new Uint8Array([
      0x41, 0x61, 0x6d, 0x6f, 0x67, 0x75, 0x73, 0x75, 0x73,
    ]);
    const notIn = new Uint8Array([0x61, 0x6d, 0x6f, 0x67]);
    const testString = new Uint8Array([0x61, 0x6d, 0x6f, 0x67, 0x75, 0x73]);
    const singleTest = new Uint8Array([0x2e]);
    expect(bufferUtils.arrayIndexOf(whole, testString)).toStrictEqual(0);
    expect(bufferUtils.arrayIndexOf(sandwiched, testString)).toStrictEqual(1);
    expect(bufferUtils.arrayIndexOf(notIn, testString)).toStrictEqual(-1);
    expect(
      bufferUtils.arrayIndexOf(new Uint8Array([49, 46, 51, 52]), singleTest),
    ).toStrictEqual(1);
  });
});
describe('arraySplit', function () {
  it('should split the array using a separator', function () {
    expect(
      bufferUtils.arraySplit(
        new Uint8Array([1, 2, 3, 4, 5, 12, 6, 7, 8, 9]),
        12,
      ),
    ).toStrictEqual([
      new Uint8Array([1, 2, 3, 4, 5]),
      new Uint8Array([6, 7, 8, 9]),
    ]);
    expect(
      bufferUtils.arraySplit(
        new Uint8Array([1, 2, 12, 4, 5, 12, 6, 7, 8, 9]),
        12,
      ),
    ).toStrictEqual([
      new Uint8Array([1, 2]),
      new Uint8Array([4, 5]),
      new Uint8Array([6, 7, 8, 9]),
    ]);
    expect(
      bufferUtils.arraySplit(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 12]), 12),
    ).toStrictEqual([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])]);
    expect(
      bufferUtils.arraySplit(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]), 12),
    ).toStrictEqual([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])]);
  });
});
describe('arrayHexToInt', function () {
  it('should parse an arrayBuffer containing a hex string', function () {
    expect(
      bufferUtils.arrayHexToInt(new Uint8Array([0x30, 0x78, 0x61, 0x32]), 2),
    ).toStrictEqual(0xa2);
  });
});
describe('arrayParseInt', function () {
  it('should parse an arrayBuffer into an int', function () {
    expect(
      bufferUtils.arrayParseInt(
        new Uint8Array([0x31, 0x34, 0x32, 0x38, 0x35, 0x37]),
      ),
    ).toStrictEqual(142857);
    expect(
      bufferUtils.arrayParseInt(
        new Uint8Array([0x31, 0x34, 0x32, 0x20, 0x35, 0x37]),
      ),
    ).toStrictEqual(142);
  });
});

describe('arrayParseFloat', function () {
  it('should parse an arrayBuffer into a float', function () {
    expect(
      bufferUtils.arrayParseFloat(
        new Uint8Array([0x31, 0x2e, 0x34, 0x32, 0x38, 0x35, 0x37]),
      ),
    ).toStrictEqual(1.42857);
    expect(
      bufferUtils.arrayParseFloat(
        new Uint8Array([0x31, 0x2e, 0x34, 0x32, 0x38, 0x35, 0x37]),
      ),
    ).toStrictEqual(1.42857);
    expect(
      bufferUtils.arrayParseFloat(
        new Uint8Array([0x31, 0x34, 0x32, 0x38, 0x35, 0x37, 0x45, 0x2d, 0x35]),
      ),
    ).toStrictEqual(1.42857);
    expect(
      bufferUtils.arrayParseFloat(
        new Uint8Array([0x31, 0x34, 0x32, 0x38, 0x35, 0x37, 0x45, 0x2b, 0x31]),
      ),
    ).toStrictEqual(1428570);
    expect(
      bufferUtils.arrayParseFloat(
        new Uint8Array([0x31, 0x34, 0x32, 0x38, 0x35, 0x37, 0x45, 0x2b]),
      ),
    ).toStrictEqual(142857);
  });
});

describe('arrayDecode', function () {
  it('should decode an arrayBuffer', function () {
    const array = new Uint8Array([
      0x31, 0x34, 0x32, 0x38, 0x35, 0x37, 0x45, 0x2d, 0x35,
    ]);
    const threeBytes = new Uint8Array([0xe2, 0x82, 0xac]);
    const fourBytesMix = new Uint8Array([
      0xe0, 0xb6, 0x9e, 0xf0, 0x9f, 0x97, 0xa1, 0xe0, 0xb6, 0x9e,
    ]);
    expect(bufferUtils.arrayDecode(array)).toStrictEqual('142857E-5');
    expect(bufferUtils.arrayDecode(threeBytes)).toStrictEqual('€');
    expect(bufferUtils.arrayDecode(fourBytesMix)).toStrictEqual('ඞ🗡ඞ');
  });
});

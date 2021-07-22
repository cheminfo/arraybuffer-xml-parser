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
    expect(bufferUtils.arrayIndexOf(whole, testString)).toStrictEqual(0);
    expect(bufferUtils.arrayIndexOf(sandwiched, testString)).toStrictEqual(1);
    expect(bufferUtils.arrayIndexOf(notIn, testString)).toStrictEqual(-1);
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
  });
});

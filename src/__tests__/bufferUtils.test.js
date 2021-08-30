import { arrayTrim, arrayIndexOf, arraySplit } from '../bufferUtils';

describe('arrayTrim', function () {
  it('should remove all spaces at beginning and end', function () {
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
    const repeaTest = new Uint8Array([0x5d, 0x5d, 0x3e]);
    const repeats = new Uint8Array([0x5d, 0x5d, 0x5d, 0x5d, 0x3e, 0x5d]);
    expect(arrayIndexOf(whole, testString)).toStrictEqual(0);
    expect(arrayIndexOf(sandwiched, testString)).toStrictEqual(1);
    expect(arrayIndexOf(notIn, testString)).toStrictEqual(-1);
    expect(
      arrayIndexOf(new Uint8Array([49, 46, 51, 52]), singleTest),
    ).toStrictEqual(1);
    expect(arrayIndexOf(repeats, repeaTest)).toStrictEqual(2);
  });
});

describe('arraySplit', function () {
  it('should split the array with a separator', function () {
    expect(
      arraySplit(new Uint8Array([1, 2, 3, 4, 5, 12, 6, 7, 8, 9]), 12),
    ).toStrictEqual([
      new Uint8Array([1, 2, 3, 4, 5]),
      new Uint8Array([6, 7, 8, 9]),
    ]);
    expect(
      arraySplit(new Uint8Array([1, 2, 12, 4, 5, 12, 6, 7, 8, 9]), 12),
    ).toStrictEqual([
      new Uint8Array([1, 2]),
      new Uint8Array([4, 5]),
      new Uint8Array([6, 7, 8, 9]),
    ]);
    expect(
      arraySplit(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 12]), 12),
    ).toStrictEqual([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])]);
    expect(
      arraySplit(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]), 12),
    ).toStrictEqual([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])]);
  });
});

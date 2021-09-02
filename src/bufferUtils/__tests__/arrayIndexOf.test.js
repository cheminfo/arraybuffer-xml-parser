import { arrayIndexOf } from '../arrayIndexOf';

describe('arrayIndexOf', () => {
  it('should find the index pointing to the begining of the found string in array', () => {
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

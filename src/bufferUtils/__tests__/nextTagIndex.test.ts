import { describe, expect, it } from 'vitest';

import { nextTagIndex } from '../nextTagIndex.ts';

const LT = 0x3c;

function wordsOf(data: Uint8Array) {
  return data.byteOffset % 4 === 0
    ? new Uint32Array(
        data.buffer,
        data.byteOffset,
        Math.floor(data.byteLength / 4),
      )
    : null;
}

function reference(data: Uint8Array, from: number) {
  for (let i = from; i < data.length; i++) {
    if (data[i] === LT) return i;
  }
  return -1;
}

describe('nextTagIndex', () => {
  it('finds the next tag', () => {
    const data = new TextEncoder().encode('<a>hello</a>');

    expect(nextTagIndex(data, wordsOf(data), 0)).toBe(0);
    expect(nextTagIndex(data, wordsOf(data), 1)).toBe(8);
    expect(nextTagIndex(data, wordsOf(data), 9)).toBe(-1);
  });

  it('never returns an index before `from`', () => {
    // a match in the last whole word plus a start inside the trailing bytes
    // used to rewind the scan, which spins the parser loop forever
    const data = new TextEncoder().encode('<a>hello</a><>z');
    const words = wordsOf(data);
    const rewinds: number[] = [];
    for (let from = 0; from <= data.length; from++) {
      const found = nextTagIndex(data, words, from);

      expect(found).toBe(reference(data, from));

      if (found !== -1 && found < from) rewinds.push(from);
    }

    expect(rewinds).toStrictEqual([]);
  });

  it('matches a plain scan for every length, pattern and start', () => {
    let checked = 0;
    for (let length = 1; length <= 40; length++) {
      for (let pattern = 0; pattern < 64; pattern++) {
        const data = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          data[i] = (pattern >> (i % 6)) & 1 ? LT : 0x41;
        }
        const words = wordsOf(data);
        for (let from = 0; from <= length; from++) {
          expect(nextTagIndex(data, words, from)).toBe(reference(data, from));

          checked++;
        }
      }
    }

    expect(checked).toBe(55040);
  });

  it('agrees with a plain scan on unaligned views', () => {
    const source = new TextEncoder().encode('<a><b>x</b></a><c/>');
    for (let offset = 0; offset < 4; offset++) {
      const padded = new Uint8Array(source.length + offset);
      padded.set(source, offset);
      const view = padded.subarray(offset);
      for (let from = 0; from <= view.length; from++) {
        expect(nextTagIndex(view, wordsOf(view), from)).toBe(
          reference(view, from),
        );
      }
    }
  });
});

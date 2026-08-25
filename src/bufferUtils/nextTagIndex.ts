const LT = 0x3c;
const LT_WORD = 0x3c3c3c3c;
const LOW_BITS = 0x01010101;
const HIGH_BITS = 0x80808080;

/**
 * Index of the next '<' at or after `from`, or -1 if there is none.
 * Scans four bytes at a time with a SWAR zero-byte test. Neither
 * TypedArray.prototype.indexOf nor a per-byte loop comes close, and unlike
 * Buffer.prototype.indexOf this behaves the same in the browser and in node.
 * @param data - bytes to scan.
 * @param words - a Uint32Array view over `data`, or null when it is not 4-byte aligned.
 * @param from - index to start scanning from.
 * @returns the index of the next '<', or -1.
 */
export function nextTagIndex(
  data: Uint8Array,
  words: Uint32Array | null,
  from: number,
): number {
  const length = data.length;
  let index = from;
  if (words === null) {
    for (; index < length; index++) {
      if (data[index] === LT) return index;
    }
    return -1;
  }
  const alignEnd = Math.min(length, Math.ceil(index / 4) * 4);
  for (; index < alignEnd; index++) {
    if (data[index] === LT) return index;
  }
  const wordCount = words.length;
  let word = Math.floor(index / 4);
  const unrollEnd = wordCount - 3;
  for (; word < unrollEnd; word += 4) {
    const a = (words[word] as number) ^ LT_WORD;
    const b = (words[word + 1] as number) ^ LT_WORD;
    const c = (words[word + 2] as number) ^ LT_WORD;
    const d = (words[word + 3] as number) ^ LT_WORD;
    const maskA = (a - LOW_BITS) & ~a & HIGH_BITS;
    const maskB = (b - LOW_BITS) & ~b & HIGH_BITS;
    const maskC = (c - LOW_BITS) & ~c & HIGH_BITS;
    const maskD = (d - LOW_BITS) & ~d & HIGH_BITS;
    if ((maskA | maskB | maskC | maskD) !== 0) {
      if (maskA !== 0) return word * 4 + byteOfMask(maskA);
      if (maskB !== 0) return (word + 1) * 4 + byteOfMask(maskB);
      if (maskC !== 0) return (word + 2) * 4 + byteOfMask(maskC);
      return (word + 3) * 4 + byteOfMask(maskD);
    }
  }
  for (; word < wordCount; word++) {
    const x = (words[word] as number) ^ LT_WORD;
    const mask = (x - LOW_BITS) & ~x & HIGH_BITS;
    if (mask !== 0) return word * 4 + byteOfMask(mask);
  }
  // never rewind: index is already past the last whole word when the scan
  // started inside the trailing bytes
  for (index = Math.max(index, wordCount * 4); index < length; index++) {
    if (data[index] === LT) return index;
  }
  return -1;
}

/**
 * Position within a word of the first matching byte, from the SWAR mask.
 * @param mask - the SWAR match mask, known to be non-zero.
 * @returns a byte offset in 0..3.
 */
function byteOfMask(mask: number): number {
  return (31 - Math.clz32(mask & -mask)) >> 3;
}

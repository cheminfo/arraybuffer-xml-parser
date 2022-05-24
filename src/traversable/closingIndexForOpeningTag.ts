import { decoder } from './utils/utf8Decoder';

/**
 * Search for the corresponding closing tag '>'
 * @param data
 * @param i
 * @returns
 */
export function closingIndexForOpeningTag(
  data: Uint8Array,
  i: number,
): {
  data: string;
  index: number;
} {
  let attrBoundary;
  let endIndex = 0;
  for (let index: number = i; index < data.length; index++) {
    let byte = data[index];
    if (attrBoundary) {
      if (byte === attrBoundary) attrBoundary = 0; //reset
    } else if (byte === 0x22 || byte === 0x27) {
      attrBoundary = byte;
    } else if (byte === 0x3e) {
      return {
        data: decoder.decode(data.subarray(i, i + endIndex)),
        index,
      };
    } else if (byte === 0x09) {
      byte = 0x20;
    }
    endIndex++;
  }
  throw new Error('Could not find closing tag');
}

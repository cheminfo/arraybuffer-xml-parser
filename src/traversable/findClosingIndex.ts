import { arrayIndexOf } from '../bufferUtils/arrayIndexOf';

export function findClosingIndex(
  xmlData: Uint8Array,
  str: Uint8Array | number[],
  i: number,
  errMsg: string,
) {
  const closingIndex = arrayIndexOf(xmlData, str, i);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}

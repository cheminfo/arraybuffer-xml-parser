import { arrayIndexOf } from '../bufferUtils/arrayIndexOf';

export function findClosingIndex(xmlData, str, i, errMsg) {
  const closingIndex = arrayIndexOf(xmlData, str, i);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}

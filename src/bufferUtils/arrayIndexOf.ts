export function arrayIndexOf(array:Uint8Array, referenceArray:Uint8Array, index = 0) {
  let found = 0;
  let foundIndex = -1;
  for (let i = index; i < array.length && found < referenceArray.length; i++) {
    if (array[i] === referenceArray[found]) {
      if (!found) {
        foundIndex = i;
      }
      found++;
    } else {
      if (found > 0) {
        let j = 0;
        for (
          ;
          j <= found && array[foundIndex + j] === array[foundIndex + found];
          j++
        );
        if (j < found + 1) {
          foundIndex = -1;
          found = 0;
        } else {
          foundIndex++;
        }
      } else {
        found = 0;
        foundIndex = -1;
      }
    }
  }
  if (found !== referenceArray.length) {
    foundIndex = -1;
  }
  return foundIndex;
}

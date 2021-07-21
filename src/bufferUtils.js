exports.arrayTrim = function (array) {
  let i = 0;
  for (; i < array.length; i++) {
    if (array[i] !== 0x20) {
      break;
    }
  }
  for (let j = array.length - 1; j >= i; j--) {
    if (array[j] !== 0x20) {
      array = new Uint8Array(array.buffer, i, j - i + 1);
      j = 0;
    }
  }
  return array;
};

exports.arrayIndexOf = function (array, referenceArray, index = 0) {
  let found = 0;
  let foundIndex = -1;
  for (let i = index; i < array.length && found < referenceArray.length; i++) {
    if (array[i] === referenceArray[found]) {
      if (!found) {
        foundIndex = i;
      }
      found++;
    } else {
      found = 0;
      foundIndex = -1;
    }
  }
  if (found !== referenceArray.length) {
    foundIndex = -1;
  }
  return foundIndex;
};

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

exports.arraySplit = function (array, separator) {
  const split = [];
  let lowerbound = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === separator) {
      split.push(new Uint8Array(array.buffer, lowerbound, i - lowerbound));
      lowerbound = i + 1;
    }
  }
  if (lowerbound !== array.length) {
    split.push(
      new Uint8Array(array.buffer, lowerbound, array.length - lowerbound),
    );
  }
  return split;
};

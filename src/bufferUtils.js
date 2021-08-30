function arrayTrim(array) {
  let i = 0;
  let j = array.length - 1;
  for (; i < array.length && array[i] <= 0x20; i++);
  for (; j >= i && array[j] <= 0x20; j--);
  return array.subarray(i, j + 1);
}

function arrayIndexOf(array, referenceArray, index = 0) {
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

function arraySplit(array, separator) {
  const split = [];
  let lowerbound = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === separator) {
      split.push(array.subarray(lowerbound, i));
      lowerbound = i + 1;
    }
  }
  if (lowerbound !== array.length) {
    split.push(array.subarray(lowerbound));
  }
  return split;
}

function containsNumber(array) {
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (value !== 0x20 && value !== 0x2b && value !== 0x2d) {
      if (value >= 0x30 && value <= 0x39) {
        return true;
      }
      return false;
    }
  }
  return false;
}

module.exports = {
  arrayTrim,
  arrayIndexOf,
  arraySplit,
  containsNumber,
};

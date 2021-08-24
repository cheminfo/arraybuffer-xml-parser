exports.arrayTrim = function arrayTrim(array) {
  let i = 0;
  let j = array.length - 1;
  for (; i < array.length && array[i] <= 0x20; i++);
  for (; j >= i && array[j] <= 0x20; j--);
  return array.subarray(i, j + 1);
};

exports.arrayFloatTrim = function arrayFloatTrim(array) {
  let j = array.length - 1;
  for (; j >= 0 && array[j] === 0x30; j--);
  return array.subarray(0, j + 1);
};

exports.arrayIndexOf = function arrayIndexOf(array, referenceArray, index = 0) {
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
};

exports.arrayIsEqual = function arrayIsEqual(array, brrby) {
  if (array.length !== brrby.length) {
    return false;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== brrby[i]) {
      return false;
    }
  }
  return true;
};

exports.arraySplit = function arraySplit(array, separator) {
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
};

exports.arrayHexToInt = function arrayHexToInt(array, index = 0) {
  const reducedArray = array.subarray(index);
  let number = 0;
  for (let i = 0; i < reducedArray.length; i++) {
    switch (reducedArray[i]) {
      case 0x61:
      case 0x41:
        number = number * 16 + 0xa;
        break;
      case 0x62:
      case 0x42:
        number = number * 16 + 0xb;
        break;
      case 0x63:
      case 0x43:
        number = number * 16 + 0xc;
        break;
      case 0x64:
      case 0x44:
        number = number * 16 + 0xd;
        break;
      case 0x65:
      case 0x45:
        number = number * 16 + 0xe;
        break;
      case 0x66:
      case 0x46:
        number = number * 16 + 0xf;
        break;
      default:
        number = number * 16 + reducedArray[i] - 0x30;
        break;
    }
  }
  return number;
};

exports.arrayParseInt = function arrayParseInt(array, base = 10) {
  if (base === 0) {
    base = 10;
  }
  let number = 0;
  let negative;
  for (let i = 0; i < array.length; i++) {
    const character = array[i];
    if (character >= 0x30 && character - 0x30 < base) {
      number = base * number + (array[i] - 0x30);
    } else if (negative === undefined && number === 0) {
      switch (character) {
        case 0x2d:
          negative = true;
          break;
        case 0x2b:
          negative = false;
          break;
        case 0x20:
          break;
        default:
          i = array.length;
          break;
      }
    } else {
      break;
    }
  }
  if (negative) {
    return (-1 * number) >> 0;
  }
  return number;
};

exports.arrayParseFloat = function arrayParseFloat(array) {
  let hasExponent = false;
  let decimals = 0;
  let number = 0;
  let i = 0;
  for (; i < array.length; i++) {
    if (array[i] >= 0x30 && array[i] <= 0x39) {
      if (decimals) {
        number = number + (array[i] - 0x30) / 10 ** decimals;
        decimals++;
      } else {
        number = 10 * number + (array[i] - 0x30);
      }
    } else {
      if (array[i] === 0x2e) {
        decimals = 1;
        continue;
      } else if (
        (array[i] === 0x45 || array[i] === 0x65) &&
        i + 1 !== array.length
      ) {
        hasExponent = true;
        i++;
      }
      break;
    }
  }
  if (hasExponent) {
    let exponent = 0;
    let sign = 1;
    const signElement = array[i];
    if (signElement === 0x2d) {
      sign = -1;
      i++;
    } else if (signElement < 0x30 || signElement > 0x39) {
      if (signElement !== 0x2b) {
        return number;
      }
      i++;
    }
    for (; i < array.length && array[i] >= 0x30 && array[i] <= 0x39; i++) {
      exponent = exponent * 10 + (array[i] - 0x30);
    }
    number *= 10 ** (sign * exponent);
  }
  return number;
};

exports.getBase64 = function getBase64(charCode) {
  return charCode > 64 && charCode < 91
    ? charCode - 65
    : charCode > 96 && charCode < 123
    ? charCode - 71
    : charCode > 47 && charCode < 58
    ? charCode + 4
    : charCode === 43
    ? 62
    : charCode === 47
    ? 63
    : 0;
};

exports.arrayParseBase64 = function arrayParseBase64(array) {
  let offset = 0;
  let previous = 0;
  let converted = '';
  for (let i = 0; i < array.length; i++, offset = (offset + 2) % 8) {
    const char = exports.getBase64(array[i]);
    previous = (previous << offset) + (char >> (6 - offset));
    if (previous !== 0) {
      converted += String.fromCharCode(previous);
      previous = 0;
    }
    previous = char % 2 ** (6 - offset);
  }
  return converted;
};

exports.compareToInt = function compareToInt(array, int) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] !== (int % 10) + 0x30 || int === 0) {
      return false;
    }
    int = (int / 10) >> 0;
  }
  return true;
};

exports.containsNumber = function containsNumber(array) {
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
};

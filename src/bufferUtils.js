exports.arrayTrim = function (array) {
  let i = 0;
  let j = array.length - 1;
  for (; i < array.length && (array[i] === 0x20 || array[i] === 0x0a); i++);
  for (; j >= i && (array[j] === 0x20 || array[j] === 0x0a); j--);
  return new Uint8Array(array.buffer, i, j - i + 1);
};

exports.arrayFloatTrim = function (array) {
  let j = array.length - 1;
  for (; j >= 0 && array[j] === 0x30; j--);
  return new Uint8Array(array.buffer, 0, j + 1);
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

exports.arrayIsEqual = function (array, brrby) {
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

exports.arrayHexToInt = function (array, index = 0) {
  const reducedArray = new Uint8Array(array.buffer, index);
  for (let i = 0; i < reducedArray.length; i++) {
    switch (reducedArray[i]) {
      case 0x61:
      case 0x41:
        reducedArray[i] = 0x3a;
        break;
      case 0x62:
      case 0x42:
        reducedArray[i] = 0x3b;
        break;
      case 0x63:
      case 0x43:
        reducedArray[i] = 0x3c;
        break;
      case 0x64:
      case 0x44:
        reducedArray[i] = 0x3d;
        break;
      case 0x65:
      case 0x45:
        reducedArray[i] = 0x3e;
        break;
      case 0x66:
      case 0x46:
        reducedArray[i] = 0x3f;
        break;
      default:
        break;
    }
  }
  return exports.arrayParseInt(reducedArray, 16);
};

exports.arrayParseInt = function (array, base = 10) {
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

exports.arrayParseFloat = function (array) {
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

exports.arrayDecode = function (array) {
  let output = '';
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (value <= 0x7f) {
      output += String.fromCodePoint(array[i]);
    } else if (value >= 0b11110000) {
      const thing =
        ((value & 0x07) << 18) |
        ((array[i + 1] & 0x3f) << 12) |
        ((array[i + 2] & 0x3f) << 6) |
        (array[i + 3] & 0x3f);
      output += String.fromCodePoint(thing); //String.fromCharCode(thing);
      i += 3;
    } else {
      if (value >= 0b11100000) {
        output += String.fromCodePoint(
          ((value & 0x0f) << 12) |
            ((array[i + 1] & 0x3f) << 6) |
            (array[i + 2] & 0x3f),
        );
        i += 2;
      } else if (value >= 0b110000) {
        output += String.fromCodePoint(
          ((value & 0x1f) << 6) | (array[i + 1] & 0x3f),
        );
        i++;
      }
    }
  }

  return output;
};

exports.compareToInt = function (array, int) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] !== (int % 10) + 0x30 || int === 0) {
      return false;
    }
    int = (int / 10) >> 0;
  }
  return true;
};

const nameStartChar =
  ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = `${nameStartChar}\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
const nameRegexp = `[${nameStartChar}][${nameChar}]*`;
// eslint-disable-next-line no-misleading-character-class
const regexName = new RegExp(`^${nameRegexp}$`);

const getAllMatches = function (string, regex) {
  return Array.from(string.matchAll(regex));
};

const isName = function (string) {
  return regexName.exec(string) !== undefined;
};

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Copy all the properties of a into b.
 * @param {object} target
 * @param {object} a
 */
function merge(target, a, arrayMode) {
  if (!a) return;
  for (const key in a) {
    if (arrayMode === 'strict') {
      target[key] = [a[key]];
    } else {
      target[key] = a[key];
    }
  }
}

function getValue(v) {
  return v === undefined ? '' : v;
}

/**
 * This method check that only allowed props are in the options object and append the default options
 * @param {object} options
 * @param {object} defaultOptions
 * @param {array} props
 * @returns
 */
function buildOptions(options, defaultOptions, props) {
  let newOptions = {};
  if (!options) {
    return defaultOptions; //if there are not options
  }

  for (let i = 0; i < props.length; i++) {
    if (options[props[i]] !== undefined) {
      newOptions[props[i]] = options[props[i]];
    } else {
      newOptions[props[i]] = defaultOptions[props[i]];
    }
  }
  return newOptions;
}

/**
 * Check if a tag name should be treated as array
 *
 * @param tagName the node tagname
 * @param arrayMode the array mode option
 * @param parentTagName the parent tag name
 * @returns {boolean} true if node should be parsed as array
 */
function isTagNameInArrayMode(tagName, arrayMode, parentTagName) {
  if (arrayMode === false) {
    return false;
  } else if (arrayMode instanceof RegExp) {
    return arrayMode.test(tagName);
  } else if (typeof arrayMode === 'function') {
    return !!arrayMode(tagName, parentTagName);
  }

  return arrayMode === 'strict';
}

module.exports = {
  isName,
  getAllMatches,
  nameRegexp,
  isTagNameInArrayMode,
  buildOptions,
  merge,
  getValue,
  isEmptyObject,
};

const { isTagNameInArrayMode, merge, isEmptyObject } = require('./util');

const convertToJson = function (node, options, parentTagName) {
  const jObj = {};

  // when no child node or attr is present
  if (
    (!node.child || isEmptyObject(node.child)) &&
    (!node.attrsMap || isEmptyObject(node.attrsMap))
  ) {
    return node.val === undefined ? '' : node.val;
  }

  // otherwise create a textnode if node has some text
  if (
    node.val !== undefined &&
    !(
      typeof node.val === 'string' &&
      (node.val === '' || node.val === options.cdataPositionChar)
    )
  ) {
    const asArray = isTagNameInArrayMode(
      node.tagname,
      options.arrayMode,
      parentTagName,
    );
    jObj[options.textNodeName] = asArray ? [node.val] : node.val;
  }

  merge(jObj, node.attrsMap, options.arrayMode);

  const keys = Object.keys(node.child);
  for (let index = 0; index < keys.length; index++) {
    const tagName = keys[index];
    if (node.child[tagName] && node.child[tagName].length > 1) {
      jObj[tagName] = [];
      for (let tag in node.child[tagName]) {
        if (node.child[tagName].hasOwnProperty(tag)) {
          jObj[tagName].push(
            convertToJson(node.child[tagName][tag], options, tagName),
          );
        }
      }
    } else {
      const result = convertToJson(node.child[tagName][0], options, tagName);
      const asArray =
        (options.arrayMode === true && typeof result === 'object') ||
        isTagNameInArrayMode(tagName, options.arrayMode, parentTagName);
      jObj[tagName] = asArray ? [result] : result;
    }
  }

  //add value
  return jObj;
};

exports.convertToJson = convertToJson;

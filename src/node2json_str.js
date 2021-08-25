const { merge, isEmptyObject } = require('./util');
const { buildOptions } = require('./util');
const { defaultOptions, props } = require('./xmlbuffer2xmlnode');

//TODO: do it later
function convertToJsonString(node, options) {
  options = buildOptions(options, defaultOptions, props);

  options.indentBy = options.indentBy || '';
  return recursiveConvert(node, options, 0);
}

const recursiveConvert = function (node, options) {
  let jObj = '{';

  //traverse through all the children
  for (const tagname in node.child) {
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj += `"${tagname}" : [ `;
      for (let tag in node.child[tagname]) {
        jObj += `${recursiveConvert(node.child[tagname][tag], options)} , `;
      }
      jObj = `${jObj.substr(0, jObj.length - 1)} ] `; //remove extra comma in last
    } else {
      jObj += `"${tagname}" : ${recursiveConvert(
        node.child[tagname][0],
        options,
      )} ,`;
    }
  }
  merge(jObj, node.attrsMap);
  //add attrsMap as new children
  if (isEmptyObject(jObj)) {
    return node.val === undefined ? '' : node.val;
  } else {
    if (node.val !== undefined) {
      if (
        !(
          typeof node.val === 'string' &&
          (node.val === '' || node.val === options.cdataPositionChar)
        )
      ) {
        jObj += `"${options.textNodeName}" : ${stringval(node.val)}`;
      }
    }
  }
  //add value
  if (jObj[jObj.length - 1] === ',') {
    jObj = jObj.substr(0, jObj.length - 2);
  }
  return jObj;
};

function stringval(v) {
  if (v === true || v === false || !isNaN(v)) {
    return v;
  } else {
    return String(v);
  }
}

module.exports = { convertToJsonString };

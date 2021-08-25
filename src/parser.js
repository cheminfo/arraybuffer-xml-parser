const nodeToJson = require('./node2json');
const { buildOptions } = require('./util');
const {
  defaultOptions,
  props,
  getTraversalObj,
} = require('./xmlbuffer2xmlnode');

exports.parse = function (xmlData, options, validationOption) {
  if (typeof xmlData === 'string') {
    const encoder = new TextEncoder();
    xmlData = encoder.encode(xmlData);
  }
  if (validationOption) {
    if (validationOption === true) validationOption = {};
  }
  options = buildOptions(options, defaultOptions, props);
  const traversableObj = getTraversalObj(xmlData, options);
  //print(traversableObj, "  ");
  return nodeToJson.convertToJson(traversableObj, options);
};

exports.convertToJson = nodeToJson.convertToJson;
exports.convertToJsonString = require('./node2json_str').convertToJsonString;

exports.j2xParser = require('./json2xml');

exports.parseToNimn = function (xmlData, schema, options) {
  return exports.convertTonimn(
    exports.getTraversalObj(xmlData, options),
    schema,
    options,
  );
};

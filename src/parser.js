const nodeToJson = require('./node2json');
const { buildOptions } = require('./util');
const xmlbuffer2xmlnode = require('./xmlbuffer2xmlnode');

exports.parse = function (xmlData, options, validationOption) {
  if (typeof xmlData === 'string') {
    const encoder = new TextEncoder();
    xmlData = encoder.encode(xmlData);
  }
  if (validationOption) {
    if (validationOption === true) validationOption = {};
  }
  options = buildOptions(
    options,
    xmlbuffer2xmlnode.defaultOptions,
    xmlbuffer2xmlnode.props,
  );
  const traversableObj = xmlbuffer2xmlnode.getTraversalObj(xmlData, options);
  //print(traversableObj, "  ");
  return nodeToJson.convertToJson(traversableObj, options);
};

exports.buffer2node = xmlbuffer2xmlnode.exports;
exports.getTraversalObj = xmlbuffer2xmlnode.getTraversalObj;
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

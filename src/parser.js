const nodeToJson = require('./node2json');
const xmlbuffer2xmlnode = require('./xmlbuffer2xmlnode');
const xmlToNodeobj = require('./xmlstr2xmlnode');
const x2xmlnode = require('./xmlstr2xmlnode');
const buildOptions = require('./util').buildOptions;
const validator = require('./validator');

exports.parse = function (xmlData, options, validationOption) {
  if (validationOption) {
    if (validationOption === true) validationOption = {};

    const result = validator.validate(xmlData, validationOption);
    if (result !== true) {
      throw Error(result.err.msg);
    }
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

exports.validate = validator.validate;
exports.j2xParser = require('./json2xml');

exports.parseToNimn = function (xmlData, schema, options) {
  return exports.convertTonimn(
    exports.getTraversalObj(xmlData, options),
    schema,
    options,
  );
};

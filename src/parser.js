const nodeToJson = require('./node2json');
const xmlbuffer2node = require('./xmlbuffer2xmlnode');
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
  options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
  const traversableObj = xmlToNodeobj.getTraversalObj(xmlData, options);
  //print(traversableObj, "  ");
  return nodeToJson.convertToJson(traversableObj, options);
};

exports.getTraversalObj = xmlToNodeobj.getTraversalObj;
exports.convertToJson = nodeToJson.convertToJson;
exports.convertToJsonString = require('./node2json_str').convertToJsonString;

exports.xml2node = xmlbuffer2node.exports;
exports.validate = validator.validate;
exports.j2xParser = require('./json2xml');

exports.parseToNimn = function (xmlData, schema, options) {
  return exports.convertTonimn(
    exports.getTraversalObj(xmlData, options),
    schema,
    options,
  );
};

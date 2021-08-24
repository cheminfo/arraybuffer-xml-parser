const bufferUtils = require('./bufferUtils');
const util = require('./util');
const buildOptions = require('./util').buildOptions;
const xmlNode = require('./xmlNode');

const decoder = new TextDecoder();

const defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false, //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseNodeValue: true,
  parseAttributeValue: false,
  arrayMode: false,
  trimValues: true, //Trim string values of tag and attributes
  cdataTagName: false,
  cdataPositionChar: '\\c',
  tagValueProcessor: function (a) {
    return a;
  },
  attrValueProcessor: function (a) {
    return a;
  },
  stopNodes: [],
  //decodeStrict: false,
};

exports.defaultOptions = defaultOptions;

const props = [
  'attributeNamePrefix',
  'attrNodeName',
  'textNodeName',
  'ignoreAttributes',
  'ignoreNameSpace',
  'allowBooleanAttributes',
  'parseNodeValue',
  'parseAttributeValue',
  'arrayMode',
  'trimValues',
  'cdataTagName',
  'cdataPositionChar',
  'tagValueProcessor',
  'attrValueProcessor',
  'parseTrueNumberOnly',
  'stopNodes',
];
exports.props = props;

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} val
 * @param {object} options
 */
function processTagValue(tagName, val, options) {
  if (val) {
    if (options.trimValues) {
      val = bufferUtils.arrayTrim(val);
    }
    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
  }

  return val;
}
function stringProcessTagValue(tagName, val, options) {
  if (val) {
    if (options.trimValues) {
      val = val.trim();
    }
    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
  }

  return val;
}

function resolveNameSpace(tagname, options) {
  if (options.ignoreNameSpace) {
    const tags = tagname.split(':');
    const prefix = tagname.charAt(0) === '/' ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}
function parseValue(val, shouldParse, parseTrueNumberOnly) {
  if (shouldParse && typeof val === 'object') {
    let parsed;
    if (val.length === 0 || !bufferUtils.containsNumber(val)) {
      parsed = bufferUtils.arrayIsEqual(val, [116, 114, 117, 101]) //true
        ? true
        : bufferUtils.arrayIsEqual(val, [0x66, 0x61, 0x6c, 0x73, 0x65]) //false
        ? false
        : decoder.decode(val).replace(/\r\n?/g, '\n');
    } else {
      if (bufferUtils.arrayIndexOf(val, [0x30, 0x78]) !== -1) {
        //0x
        //support hexa decimal
        parsed = bufferUtils.arrayHexToInt(
          val,
          bufferUtils.arrayIndexOf(val, [0x30, 0x78]) + 2,
        );
      } else if (bufferUtils.arrayIndexOf(val, [0x2e]) !== -1) {
        //.
        parsed = bufferUtils.arrayParseFloat(val);
        val = bufferUtils.arrayFloatTrim(val);
      } else {
        parsed = bufferUtils.arrayParseInt(val, 10);
        if (parseTrueNumberOnly && !bufferUtils.compareToInt(val, parsed)) {
          parsed = decoder.decode(val);
        }
      }
    }
    return parsed;
  } else {
    if (util.isExist(val)) {
      if (typeof val === 'string') {
        return val.replace(/\r\n?/g, '\n');
      }
      return decoder.decode(val).replace(/\r\n?/g, '\n');
    } else {
      return '';
    }
  }
}

function stringParseValue(val, shouldParse, parseTrueNumberOnly) {
  if (shouldParse && typeof val === 'string') {
    let parsed;
    if (val.trim() === '' || isNaN(val)) {
      parsed = val === 'true' ? true : val === 'false' ? false : val;
    } else {
      if (val.indexOf('0x') !== -1) {
        //support hexa decimal
        parsed = Number.parseInt(val, 16);
      } else if (val.indexOf('.') !== -1) {
        parsed = Number.parseFloat(val);
        val = val.replace(/\.?0+$/, '');
      } else {
        parsed = Number.parseInt(val, 10);
      }
      if (parseTrueNumberOnly) {
        parsed = String(parsed) === val ? parsed : val;
      }
    }
    return parsed;
  } else {
    if (util.isExist(val)) {
      return val;
    } else {
      return '';
    }
  }
}

const newLocal = '([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?';
//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
const attrsRegx = new RegExp(newLocal, 'g');
//Attributes are strings so no point in using arrayBuffers here
function buildAttributesMap(attrStr, options) {
  if (!options.ignoreAttributes && typeof attrStr === 'string') {
    attrStr = attrStr.replace(/\r?\n/g, ' ');
    //attrStr = attrStr || attrStr.trim();

    const matches = util.getAllMatches(attrStr, attrsRegx);
    const len = matches.length; //don't make it inline
    const attrs = {};
    for (let i = 0; i < len; i++) {
      const attrName = resolveNameSpace(matches[i][1], options);
      if (attrName.length) {
        if (matches[i][4] !== undefined) {
          if (options.trimValues) {
            matches[i][4] = matches[i][4].trim();
          }
          matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
          attrs[options.attributeNamePrefix + attrName] = stringParseValue(
            matches[i][4],
            options.parseAttributeValue,
            options.parseTrueNumberOnly,
          );
        } else if (options.allowBooleanAttributes) {
          attrs[options.attributeNamePrefix + attrName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (options.attrNodeName) {
      const attrCollection = {};
      attrCollection[options.attrNodeName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}

const getTraversalObj = function (xmlData, options) {
  //xmlData = xmlData.replace(/\r\n?/g, '\n');
  options = buildOptions(options, defaultOptions, props);
  const xmlObj = new xmlNode('!xml');
  let currentNode = xmlObj;
  let dataSize = 0;
  let dataIndex = 0;
  //function match(xmlData){
  for (let i = 0; i < xmlData.length; i++) {
    if (xmlData[i] === 0x3c) {
      if (xmlData[i + 1] === 0x2f) {
        //Closing Tag
        const closeIndex = findClosingIndex(
          xmlData,
          [0x3e], //>
          i,
          'Closing Tag is not closed.',
        );
        let tagName = bufferUtils.arrayTrim(
          xmlData.subarray(i + 2, closeIndex),
        );

        if (options.ignoreNameSpace) {
          const colonIndex = bufferUtils.arrayIndexOf(tagName, [0x3a]);
          if (colonIndex !== -1) {
            tarName = xmlData.subarray(tagName.byteOffset + colonIndex + 1);
          }
        }

        /* if (currentNode.parent) {
          currentNode.parent.val = util.getValue(currentNode.parent.val) + '' + processTagValue2(tagName, textData , options);
        } */
        if (currentNode) {
          if (currentNode.val) {
            currentNode.val = `${util.getValue(
              currentNode.val,
            )}${processTagValue(
              tagName,
              xmlData.subarray(dataIndex, dataIndex + dataSize),
              options,
              dataIndex,
            )}`;
          } else {
            currentNode.val = processTagValue(
              tagName,
              xmlData.subarray(dataIndex, dataIndex + dataSize),
              options,
              dataIndex,
            );
          }
        }
        if (
          options.stopNodes.length &&
          options.stopNodes.includes(currentNode.tagname)
        ) {
          currentNode.child = [];
          if (currentNode.attrsMap === undefined) {
            currentNode.attrsMap = {};
          }
          currentNode.val = decoder.decode(
            new Uint8Array(
              xmlData.buffer,
              currentNode.startIndex + 1,
              i - currentNode.startIndex - 1,
            ),
          );
        }
        currentNode = currentNode.parent;
        i = closeIndex;
        dataSize = 0;
        dataIndex = i + 1;
      } else if (xmlData[i + 1] === 0x3f) {
        i = findClosingIndex(xmlData, [0x3f, 0x3e], i, 'Pi Tag is not closed.');
      } else if (
        //!--
        xmlData[i + 1] === 0x21 &&
        xmlData[i + 2] === 0x2d &&
        xmlData[i + 3] === 0x2d
      ) {
        i = findClosingIndex(
          xmlData,
          [0x2d, 0x2d, 0x3e], //-->
          i,
          'Comment is not closed.',
        );
        if (currentNode && dataSize !== 0) {
          if (currentNode.tagname !== '!xml') {
            currentNode.val = `${util.getValue(
              currentNode.val,
            )}${processTagValue(
              currentNode.tagname,
              new Uint8Array(xmlData.buffer, dataIndex, dataSize),
              options,
              dataIndex,
            )}`;
          }
        }
        dataSize = 0;
        dataIndex = i + 1;
        //!D
      } else if (xmlData[i + 1] === 0x21 && xmlData[i + 2] === 0x44) {
        const closeIndex = findClosingIndex(
          xmlData,
          [0x3e], //>
          i,
          'DOCTYPE is not closed.',
        );
        const tagExp = new Uint8Array(xmlData.buffer, i, closeIndex - i);
        if (bufferUtils.arrayIndexOf(tagExp, [0x5b]) >= 0) {
          i = bufferUtils.arrayIndexOf(xmlData, [0x5d, 0x3e], i) + 1;
        } else {
          i = closeIndex;
        } //![
      } else if (xmlData[i + 1] === 0x21 && xmlData[i + 2] === 0x5b) {
        const closeIndex =
          findClosingIndex(
            xmlData,
            [0x5d, 0x5d, 0x3e], //]]>
            i,
            'CDATA is not closed.',
          ) - 2;
        const tagExp = new Uint8Array(
          xmlData.buffer,
          i + 9,
          closeIndex - i - 9,
        );

        //considerations
        //1. CDATA will always have parent node
        //2. A tag with CDATA is not a leaf node so it's value would be string type.
        if (dataSize !== 0) {
          currentNode.val = `${util.getValue(
            currentNode.val,
          )}${stringProcessTagValue(
            currentNode.tagname,
            decoder.decode(new Uint8Array(xmlData.buffer, dataIndex, dataSize)),
            options,
            dataIndex,
          )}`;
        }

        if (options.cdataTagName) {
          //add cdata node
          const childNode = new xmlNode(
            options.cdataTagName,
            currentNode,
            decoder.decode(tagExp),
          );
          currentNode.addChild(childNode);
          //for backtracking
          currentNode.val =
            util.getValue(currentNode.val) + options.cdataPositionChar;
          //add rest value to parent node
          if (tagExp) {
            childNode.val = decoder.decode(tagExp);
          }
        } else {
          currentNode.val =
            (currentNode.val || '') + (decoder.decode(tagExp) || '');
        }

        i = closeIndex + 2;
        dataSize = 0;
        dataIndex = i + 1;
      } else {
        //Opening tag
        const result = closingIndexForOpeningTag(xmlData, i + 1);
        let tagExp = result.data;
        const closeIndex = result.index;
        tagExp = tagExp.replace(/\r\n?|\t/g, ' ');
        const separatorIndex = tagExp.indexOf(' ');
        let tagName = tagExp;
        let shouldBuildAttributesMap = true;
        if (separatorIndex !== -1) {
          tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, '');
          tagExp = tagExp.substr(separatorIndex + 1);
        }

        if (options.ignoreNameSpace) {
          const colonIndex = tagName.indexOf(':');
          if (colonIndex !== -1) {
            tagName = tagName.substr(colonIndex + 1);
            shouldBuildAttributesMap =
              tagName !== result.data.substr(colonIndex + 1);
          }
        }

        //save text to parent node
        if (currentNode && dataSize !== 0) {
          if (currentNode.tagname !== '!xml') {
            currentNode.val = `${util.getValue(
              currentNode.val,
            )}${processTagValue(
              currentNode.tagname,
              xmlData.subarray(dataIndex, dataIndex + dataSize),
              options,
              dataIndex,
            )}`;
          }
        }

        if (
          tagExp.length > 0 &&
          tagExp.lastIndexOf('/') === tagExp.length - 1
        ) {
          //selfClosing tag

          if (tagName[tagName.length - 1] === '/') {
            //remove trailing '/'
            tagName = tagName.substr(0, tagName.length - 1);
            tagExp = tagName;
          } else {
            tagExp = tagExp.substr(0, tagExp.length - 1);
          }

          const childNode = new xmlNode(tagName, currentNode, '');
          if (tagName !== tagExp) {
            childNode.attrsMap = buildAttributesMap(tagExp, options);
          }
          currentNode.addChild(childNode);
        } else {
          //opening tag

          const childNode = new xmlNode(tagName, currentNode);
          if (
            options.stopNodes.length &&
            options.stopNodes.includes(childNode.tagname)
          ) {
            childNode.startIndex = closeIndex;
          }
          if (tagName !== tagExp && shouldBuildAttributesMap) {
            childNode.attrsMap = buildAttributesMap(tagExp, options);
          }
          currentNode.addChild(childNode);
          currentNode = childNode;
        }
        i = closeIndex;
        dataSize = 0;
        dataIndex = i + 1;
      }
    } else {
      dataSize++;
    }
  }
  return xmlObj;
};

function closingIndexForOpeningTag(data, i) {
  let attrBoundary;
  let endIndex = 0;
  for (let index = i; index < data.length; index++) {
    let ch = data[index];
    if (attrBoundary) {
      if (ch === attrBoundary) attrBoundary = 0; //reset
    } else if (ch === 0x22 || ch === 0x27) {
      attrBoundary = ch;
    } else if (ch === 0x3e) {
      return {
        data: decoder.decode(
          new Uint8Array(data.buffer, data.byteOffset + i, endIndex),
        ),
        index: index,
      };
    } else if (ch === 0x09) {
      ch = 0x20;
    }
    endIndex++;
  }
}

function findClosingIndex(xmlData, str, i, errMsg) {
  const closingIndex = bufferUtils.arrayIndexOf(xmlData, str, i);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}
exports.getTraversalObj = getTraversalObj;
this.exports = {
  parseValue,
  getTraversalObj,
  processTagValue,
  resolveNameSpace,
  closingIndexForOpeningTag,
};

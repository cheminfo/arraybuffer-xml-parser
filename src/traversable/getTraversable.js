import { XMLNode } from '../XMLNode';
import { arrayIndexOf } from '../bufferUtils/arrayIndexOf';
import { arrayTrim } from '../bufferUtils/arrayTrim';
import { parseAttributesString } from '../parseAttributesString';
import { buildOptions, getValue } from '../util';

import { closingIndexForOpeningTag } from './closingIndexForOpeningTag';
import { findClosingIndex } from './findClosingIndex.1';
import { processTagValue } from './processTagValue';

const utf8Decoder = new TextDecoder();

export const decoder = {
  decode: (array) => {
    // in the browser the decoder is fast ... not in node 16 !!
    if (typeof window !== 'undefined') return utf8Decoder.decode(array);
    return utf8Decoder.decode(array);
    // if the array is too big and the xml file is huged the garbage collector will work too much
    // TODO: check if this is really required
    if (array.length > 100) return utf8Decoder.decode(array);
    let string = '';
    for (let value of array) {
      if (value > 127) return utf8Decoder.decode(array);
      string += String.fromCharCode(value);
    }
    return string;
  },
};

export const defaultOptions = {
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
  tagValueProcessor: (a) => a,
  attrValueProcessor: (a) => a,
  stopNodes: [],
  //decodeStrict: false,
};

export const props = [
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
  'stopNodes',
];

export function getTraversable(xmlData, options = {}) {
  options = { ...defaultOptions, ...options };
  const traversable = new XMLNode('!xml');
  let currentNode = traversable;
  let dataSize = 0;
  let dataIndex = 0;

  for (let i = 0; i < xmlData.length; i++) {
    if (xmlData[i] === 0x3c) {
      // <
      const xmlData1 = xmlData[i + 1];
      const xmlData2 = xmlData[i + 2];
      if (xmlData1 === 0x2f) {
        // </ Closing Tag
        const closeIndex = findClosingIndex(
          xmlData,
          [0x3e], //>
          i,
          'Closing Tag is not closed.',
        );
        let tagName = arrayTrim(xmlData.subarray(i + 2, closeIndex));

        if (options.ignoreNameSpace) {
          const colonIndex = arrayIndexOf(tagName, [0x3a]);
          if (colonIndex !== -1) {
            tagName = xmlData.subarray(tagName.byteOffset + colonIndex + 1);
          }
        }

        if (currentNode) {
          const value = processTagValue(
            tagName,
            xmlData.subarray(dataIndex, dataIndex + dataSize),
            options,
            dataIndex,
          );
          currentNode.val =
            currentNode.val === undefined ? value : currentNode.val + value;
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
            xmlData.subarray(currentNode.startIndex + 1, i),
          );
        }
        currentNode = currentNode.parent;
        i = closeIndex;
        dataSize = 0;
        dataIndex = i + 1;
      } else if (xmlData1 === 0x3f) {
        // <? PI, processing instruction
        i = findClosingIndex(xmlData, [0x3f, 0x3e], i, 'Pi Tag is not closed.');
      } else if (
        //!-- comment
        xmlData1 === 0x21 &&
        xmlData2 === 0x2d &&
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
            currentNode.val = `${getValue(currentNode.val)}${processTagValue(
              currentNode.tagname,
              xmlData.subarray(dataIndex, dataSize + dataIndex),
              options,
              dataIndex,
            )}`;
          }
        }
        dataSize = 0;
        dataIndex = i + 1;
        //!D
      } else if (xmlData1 === 0x21 && xmlData2 === 0x44) {
        // <!D
        const closeIndex = findClosingIndex(
          xmlData,
          [0x3e], //>
          i,
          'DOCTYPE is not closed.',
        );
        const tagExp = xmlData.subarray(i, closeIndex);
        if (arrayIndexOf(tagExp, [0x5b]) >= 0) {
          i = arrayIndexOf(xmlData, [0x5d, 0x3e], i) + 1;
        } else {
          i = closeIndex;
        } //![
      } else if (xmlData1 === 0x21 && xmlData2 === 0x5b) {
        // <![CDATA[some stuff]]>
        const closeIndex =
          findClosingIndex(
            xmlData,
            [0x5d, 0x5d, 0x3e], //]]>
            i,
            'CDATA is not closed.',
          ) - 2;
        const tagExp = xmlData.subarray(i + 9, closeIndex);

        //considerations
        //1. CDATA will always have parent node
        //2. A tag with CDATA is not a leaf node so it's value would be string type.
        if (dataSize !== 0) {
          const value = processTagValue(
            currentNode.tagname,
            xmlData.subarray(dataIndex, dataIndex + dataSize),
            options,
            dataIndex,
          );

          currentNode.val = `${getValue(currentNode.val)}${value}`;
        }

        if (options.cdataTagName) {
          //add cdata node
          const childNode = new XMLNode(
            options.cdataTagName,
            currentNode,
            decoder.decode(tagExp),
          );
          currentNode.addChild(childNode);
          //for backtracking
          currentNode.val =
            getValue(currentNode.val) + options.cdataPositionChar;
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
        //Opening a normal tag
        const parsedOpeningTag = closingIndexForOpeningTag(xmlData, i + 1);
        let tagData = parsedOpeningTag.data.replace(/\r?\n|\t/g, ' ');
        const closeIndex = parsedOpeningTag.index;
        const separatorIndex = tagData.indexOf(' ');
        let shouldBuildAttributesMap = true;
        let tagName =
          separatorIndex >= 0
            ? tagData.substr(0, separatorIndex).replace(/\s+$/, '')
            : tagData;
        let tagAttributes =
          separatorIndex >= 0 ? tagData.substr(separatorIndex + 1) : '';
        if (options.ignoreNameSpace) {
          const colonIndex = tagName.indexOf(':');
          if (colonIndex !== -1) {
            tagName = tagName.substr(colonIndex + 1);
            shouldBuildAttributesMap =
              tagName !== parsedOpeningTag.data.substr(colonIndex + 1);
          }
        }

        //save text to parent node
        if (currentNode && dataSize !== 0) {
          if (currentNode.tagname !== '!xml') {
            currentNode.val = `${getValue(currentNode.val)}${processTagValue(
              currentNode.tagname,
              xmlData.subarray(dataIndex, dataIndex + dataSize),
              options,
              dataIndex,
            )}`;
          }
        }

        if (tagData.length > 0 && tagData[tagData.length - 1] === '/') {
          //selfClosing tag

          if (tagAttributes) {
            // <abc def="123"/>
            tagAttributes = tagAttributes.substr(0, tagAttributes.length - 1);
          } else {
            // <abc/>
            tagName = tagName.substr(0, tagName.length - 1);
          }

          const childNode = new XMLNode(tagName, currentNode, '');
          if (tagAttributes) {
            childNode.attrsMap = parseAttributesString(tagAttributes, options);
          }
          currentNode.addChild(childNode);
        } else {
          //opening tag

          const childNode = new XMLNode(tagName, currentNode);
          if (
            options.stopNodes.length &&
            options.stopNodes.includes(childNode.tagname)
          ) {
            childNode.startIndex = closeIndex;
          }
          if (tagAttributes && shouldBuildAttributesMap) {
            childNode.attrsMap = parseAttributesString(tagAttributes, options);
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
  return traversable;
}

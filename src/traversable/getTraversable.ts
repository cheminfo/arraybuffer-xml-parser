import { XMLNode } from '../XMLNode.ts';
import { arrayIndexOf } from '../bufferUtils/arrayIndexOf.ts';
import { arrayTrim } from '../bufferUtils/arrayTrim.ts';
import { nextTagIndex } from '../bufferUtils/nextTagIndex.ts';

import { closingIndexForOpeningTag } from './closingIndexForOpeningTag.ts';
import type { RealParseOptions } from './defaultOptions.ts';
import { findClosingIndex } from './findClosingIndex.ts';
import { parseAttributesString } from './parseAttributesString.ts';

export function getTraversable(xmlData: Uint8Array, options: RealParseOptions) {
  const {
    tagValueProcessor,
    trimValues,
    stopNodes,
    cdataTagName,
    ignoreNameSpace,
  } = options;
  const traversable = new XMLNode(
    '!xml',
    undefined,
    new Uint8Array(0),
    tagValueProcessor,
  );
  let currentNode = traversable;
  let dataSize = 0;
  let dataIndex = 0;
  const words =
    xmlData.byteOffset % 4 === 0
      ? new Uint32Array(
          xmlData.buffer,
          xmlData.byteOffset,
          Math.floor(xmlData.byteLength / 4),
        )
      : null;

  for (let i = 0; i < xmlData.length; i++) {
    if (xmlData[i] !== 0x3c) {
      // Skip to the next '<' with a native scan instead of one JS step per byte.
      const next = nextTagIndex(xmlData, words, i);
      if (next === -1) {
        dataSize += xmlData.length - i;
        break;
      }
      dataSize += next - i;
      i = next;
    }
    {
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
        if (currentNode) {
          currentNode.append(
            trimValues
              ? arrayTrim(xmlData.subarray(dataIndex, dataIndex + dataSize))
              : xmlData.subarray(dataIndex, dataIndex + dataSize),
          );
        }
        if (stopNodes?.length && stopNodes.includes(currentNode.tagName)) {
          currentNode.children = {};
          if (currentNode.attributes === undefined) {
            currentNode.attributes = {};
          }
          currentNode.bytes = xmlData.subarray(currentNode.startIndex + 1, i);
        }
        currentNode = currentNode.parent as XMLNode;
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
        if (currentNode && dataSize !== 0 && currentNode.tagName !== '!xml') {
          currentNode.append(
            trimValues
              ? arrayTrim(xmlData.subarray(dataIndex, dataSize + dataIndex))
              : xmlData.subarray(dataIndex, dataSize + dataIndex),
          );
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
          const value = trimValues
            ? arrayTrim(xmlData.subarray(dataIndex, dataIndex + dataSize))
            : xmlData.subarray(dataIndex, dataIndex + dataSize);

          currentNode.append(value);
        }

        if (cdataTagName) {
          //add cdata node
          const childNode = new XMLNode(
            cdataTagName,
            currentNode,
            tagExp,
            tagValueProcessor,
          );
          currentNode.addChild(childNode);
          //add rest value to parent node
          if (tagExp) {
            childNode.bytes = tagExp;
          }
        } else {
          currentNode.append(tagExp);
        }

        i = closeIndex + 2;
        dataSize = 0;
        dataIndex = i + 1;
      } else {
        //Opening a normal tag
        const parsedOpeningTag = closingIndexForOpeningTag(xmlData, i + 1);
        const tagData = parsedOpeningTag.data.replaceAll(/\r?\n|\t/g, ' ');
        const closeIndex = parsedOpeningTag.index;
        const separatorIndex = tagData.indexOf(' ');
        let shouldBuildAttributesMap = true;
        let tagName =
          separatorIndex !== -1
            ? tagData.slice(0, Math.max(0, separatorIndex)).replace(/\s+$/, '')
            : tagData;
        let tagAttributes =
          separatorIndex !== -1 ? tagData.slice(separatorIndex + 1) : '';
        if (ignoreNameSpace) {
          const colonIndex = tagName.indexOf(':');
          if (colonIndex !== -1) {
            tagName = tagName.slice(colonIndex + 1);
            shouldBuildAttributesMap =
              tagName !== parsedOpeningTag.data.slice(colonIndex + 1);
          }
        }

        //save text to parent node
        if (currentNode && dataSize !== 0 && currentNode.tagName !== '!xml') {
          currentNode.append(
            trimValues
              ? arrayTrim(xmlData.subarray(dataIndex, dataIndex + dataSize))
              : xmlData.subarray(dataIndex, dataIndex + dataSize),
          );
        }

        if (tagData.length > 0 && tagData.endsWith('/')) {
          //selfClosing tag

          if (tagAttributes) {
            // <abc def="123"/>
            tagAttributes = tagAttributes.slice(
              0,
              Math.max(0, tagAttributes.length - 1),
            );
          } else {
            // <abc/>
            tagName = tagName.slice(0, Math.max(0, tagName.length - 1));
          }

          const childNode = new XMLNode(
            tagName,
            currentNode,
            new Uint8Array(0),
            tagValueProcessor,
          );
          if (tagAttributes) {
            childNode.attributes = parseAttributesString(
              tagAttributes,
              options,
            );
          }
          currentNode.addChild(childNode);
        } else {
          //opening tag

          const childNode = new XMLNode(
            tagName,
            currentNode,
            new Uint8Array(0),
            tagValueProcessor,
          );
          if (stopNodes?.length && stopNodes.includes(childNode.tagName)) {
            childNode.startIndex = closeIndex;
          }
          if (tagAttributes && shouldBuildAttributesMap) {
            childNode.attributes = parseAttributesString(
              tagAttributes,
              options,
            );
          }
          currentNode.addChild(childNode);
          currentNode = childNode;
        }
        i = closeIndex;
        dataSize = 0;
        dataIndex = i + 1;
      }
    }
  }
  return traversable;
}

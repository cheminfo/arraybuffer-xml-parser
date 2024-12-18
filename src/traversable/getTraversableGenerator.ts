import { XMLNode } from '../XMLNode';
import { arrayIndexOf } from '../bufferUtils/arrayIndexOf';
import { arrayTrim } from '../bufferUtils/arrayTrim';

import { closingIndexForOpeningTag } from './closingIndexForOpeningTag';
import type { RealStreamParseOptions } from './defaultOptions';
import { findClosingIndex } from './findClosingIndex';
import { parseAttributesString } from './parseAttributesString';
import { removeNameSpaceIfNeeded } from './utils/removeNameSpaceIfNeeded';
import { decoder } from './utils/utf8Decoder';

export async function* getTraversableGenerator(
  readableStream: ReadableStream,
  lookupTagName: string,
  // tagValueProcessor is not mandatory so I need to change StreamParseOptions to Partial<StreamParseOptions>
  // to avoid the error: Property 'tagValueProcessor' is missing in type 'StreamParseOptions' but required in type 'Partial<StreamParseOptions>'
  // streamParseOptions: StreamParseOptions,
  options: RealStreamParseOptions,
) {
  const { tagValueProcessor } = options;
  let dataSize = 0;
  let dataIndex = 0;
  let currentNode: XMLNode | undefined;
  let lastMatchingClosedIndex = 0;
  const reader = readableStream.getReader();
  let chunk = await reader.read();
  let endStream = chunk.done;
  let xmlData = new Uint8Array(chunk.value);

  const { maxEntrySize = 1e7, maxBufferSize = 2e8 } = options;

  for (let i = 0; i < xmlData.length; i++) {
    if (xmlData.length - i < maxEntrySize && !endStream) {
      // TODO we should remove from xmlData what was processed
      if (lastMatchingClosedIndex > 0) {
        i -= lastMatchingClosedIndex;
        xmlData = xmlData.slice(lastMatchingClosedIndex);
        lastMatchingClosedIndex = 0;
      }
      let currentLength = xmlData.length;
      const newChunks = [];
      while (currentLength < maxBufferSize && !endStream) {
        // eslint-disable-next-line no-await-in-loop
        chunk = await reader.read();
        endStream = chunk.done;
        if (!endStream) {
          const newChunk = new Uint8Array(chunk.value);
          newChunks.push(newChunk);
          currentLength += newChunk.length;
        }
      }

      const newXmlData = new Uint8Array(currentLength);
      let currentShift = 0;
      newXmlData.set(xmlData, currentShift);
      currentShift += xmlData.length;
      for (const chunk of newChunks) {
        newXmlData.set(chunk, currentShift);
        currentShift += chunk.length;
      }
      xmlData = newXmlData;
    }

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
        let tagName = decoder.decode(
          arrayTrim(xmlData.subarray(i + 2, closeIndex), {}),
        );
        tagName = removeNameSpaceIfNeeded(tagName, options);

        if (currentNode) {
          currentNode.append(
            options.trimValues
              ? arrayTrim(xmlData.subarray(dataIndex, dataIndex + dataSize))
              : xmlData.subarray(dataIndex, dataIndex + dataSize),
          );
          if (
            options.stopNodes?.length &&
            options.stopNodes.includes(currentNode.tagName)
          ) {
            currentNode.children = {};
            if (currentNode.attributes === undefined) {
              currentNode.attributes = {};
            }
            currentNode.bytes = xmlData.subarray(currentNode.startIndex + 1, i);
          }
          if (tagName === lookupTagName) {
            yield currentNode;
            lastMatchingClosedIndex = i;
          }
          currentNode = currentNode.parent as XMLNode;
        }
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
            options.trimValues
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
          const value = options.trimValues
            ? arrayTrim(xmlData.subarray(dataIndex, dataIndex + dataSize))
            : xmlData.subarray(dataIndex, dataIndex + dataSize);

          currentNode?.append(value);
        }

        if (options.cdataTagName) {
          //add cdata node
          const childNode = new XMLNode(
            options.cdataTagName,
            currentNode,
            tagExp,
            tagValueProcessor,
          );
          currentNode?.addChild(childNode);
          //add rest value to parent node
          if (tagExp) {
            childNode.bytes = tagExp;
          }
        } else if (currentNode) {
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
        if (options.ignoreNameSpace) {
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
            options.trimValues
              ? arrayTrim(xmlData.subarray(dataIndex, dataIndex + dataSize))
              : xmlData.subarray(dataIndex, dataIndex + dataSize),
          );
        }

        if (tagData.length > 0 && tagData.endsWith('/')) {
          // selfClosing tag
          // TODO we should check if it match the tag and crete the currentNode
          if (currentNode) {
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
          }
        } else {
          //opening tag

          // eslint-disable-next-line no-lonely-if
          if (currentNode || tagName === lookupTagName) {
            const childNode = new XMLNode(
              tagName,
              currentNode,
              new Uint8Array(0),
              tagValueProcessor,
            );
            if (
              options.stopNodes?.length &&
              options.stopNodes.includes(childNode.tagName)
            ) {
              childNode.startIndex = closeIndex;
            }
            if (tagAttributes && shouldBuildAttributesMap) {
              childNode.attributes = parseAttributesString(
                tagAttributes,
                options,
              );
            }
            if (currentNode) currentNode.addChild(childNode);
            currentNode = childNode;
          }
        }

        i = closeIndex;
        dataSize = 0;
        dataIndex = i + 1;
      }
    } else {
      dataSize++;
    }
  }
}

import { convertToJson } from './node2json';
import { buildOptions } from './util';
import { defaultOptions, props, getTraversalObj } from './xmlbuffer2xmlnode';

export function parse(xmlData, options) {
  if (typeof xmlData === 'string') {
    const encoder = new TextEncoder();
    xmlData = encoder.encode(xmlData);
  }

  if (!ArrayBuffer.isView(xmlData)) {
    xmlData = new Uint8Array(xmlData);
  }

  options = buildOptions(options, defaultOptions, props);
  const traversableObj = getTraversalObj(xmlData, options);

  return convertToJson(traversableObj, options);
}

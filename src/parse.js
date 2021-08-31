import { convertToJson } from './node2json';
import {
  defaultOptions,
  props,
  getTraversable,
} from './traversable/getTraversable';
import { buildOptions } from './util';

export function parse(xmlData, options) {
  if (typeof xmlData === 'string') {
    const encoder = new TextEncoder();
    xmlData = encoder.encode(xmlData);
  }

  if (!ArrayBuffer.isView(xmlData)) {
    xmlData = new Uint8Array(xmlData);
  }

  options = buildOptions(options, defaultOptions, props);
  const traversableObj = getTraversable(xmlData, options);

  return convertToJson(traversableObj, options);
}

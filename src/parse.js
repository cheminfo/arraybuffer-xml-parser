import { defaultOptions } from './traversable/defaultOptions';
import { getTraversable } from './traversable/getTraversable';
import { traversableToJSON } from './traversableToJSON';

export function parse(xmlData, options = {}) {
  if (typeof xmlData === 'string') {
    const encoder = new TextEncoder();
    xmlData = encoder.encode(xmlData);
  }

  if (!ArrayBuffer.isView(xmlData)) {
    xmlData = new Uint8Array(xmlData);
  }

  options = { ...defaultOptions, ...options };

  const traversable = getTraversable(xmlData, options);

  return traversableToJSON(traversable, options);
}

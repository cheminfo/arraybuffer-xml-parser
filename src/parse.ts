import type {
  ParseOptions,
  RealParseOptions,
} from './traversable/defaultOptions.js';
import { defaultOptions } from './traversable/defaultOptions.js';
import { getTraversable } from './traversable/getTraversable.js';
import { traversableToJSON } from './traversableToJSON.js';

/**
 * Parse an ArrayBuffer or Uint8Array representing an XML and return an object
 * @param xmlData
 * @param options
 */
export function parse(
  xmlData: string | Uint8Array | ArrayBufferLike,
  options: ParseOptions = {},
) {
  if (typeof xmlData === 'string') {
    const encoder = new TextEncoder();
    xmlData = encoder.encode(xmlData);
  }

  if (!ArrayBuffer.isView(xmlData)) {
    xmlData = new Uint8Array(xmlData);
  }

  const realOptions: RealParseOptions = { ...defaultOptions, ...options };

  const traversable = getTraversable(xmlData, realOptions);

  return traversableToJSON(traversable, realOptions);
}

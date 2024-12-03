import type {
  ParseOptions,
  RealParseOptions,
} from './traversable/defaultOptions';
import { defaultOptions } from './traversable/defaultOptions';
import { getTraversable } from './traversable/getTraversable';
import { traversableToJSON } from './traversableToJSON';

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

  const traversable = getTraversable(xmlData as Uint8Array, realOptions);

  return traversableToJSON(traversable, realOptions);
}

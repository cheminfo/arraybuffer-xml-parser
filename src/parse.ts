import { defaultOptions, ParseOptions } from './traversable/defaultOptions';
import { getTraversable } from './traversable/getTraversable';
import { traversableToJSON } from './traversableToJSON';

/**
 * Parse an ArrayBuffer or Uint8Array representing an XML and return an object
 */
export async function parse(
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

  options = { ...defaultOptions, ...options };

  const traversable = getTraversable(xmlData as Uint8Array, options);

  return traversableToJSON(traversable, options);
}

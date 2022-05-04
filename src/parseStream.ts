import { ReadableStream } from 'stream/web';

import { defaultOptions, ParseOptions } from './traversable/defaultOptions';
import { getTraversable } from './traversable/getTraversable';
import { traversableToJSON } from './traversableToJSON';

/**
 * Parse a web stream representing an XML and emit objects
 */
export function* parseStream(
  readableStream: ReadableStream,
  options: ParseOptions = {},
) {
  for await (let chunk of readableStream) {
    console.log(chunk);
  }

  if (!ArrayBuffer.isView(xmlData)) {
    xmlData = new Uint8Array(xmlData);
  }

  options = { ...defaultOptions, ...options };

  const traversable = getTraversable(xmlData as Uint8Array, options);

  return traversableToJSON(traversable, options);
}

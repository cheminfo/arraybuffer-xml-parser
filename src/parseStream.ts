import type { StreamParseOptions } from './traversable/defaultOptions.js';
import { defaultStreamOptions } from './traversable/defaultOptions.js';
import { getTraversableGenerator } from './traversable/getTraversableGenerator.js';
import { traversableToJSON } from './traversableToJSON.js';

/**
 * Parse a web stream representing an XML and emit objects
 * @param readableStream
 * @param lookupTagName
 * @param options
 */
export async function* parseStream(
  readableStream: ReadableStream,
  lookupTagName: string,
  options: StreamParseOptions = {},
) {
  const realOptions = { ...defaultStreamOptions, ...options };

  for await (const traversableEntry of getTraversableGenerator(
    readableStream,
    lookupTagName,
    realOptions,
  )) {
    yield traversableToJSON(traversableEntry, realOptions);
  }
}

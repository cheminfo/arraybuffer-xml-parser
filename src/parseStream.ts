import { ReadableStream } from 'stream/web';

import {
  defaultOptions,
  StreamParseOptions,
} from './traversable/defaultOptions';
import { getTraversableGenerator } from './traversable/getTraversableGenerator';
import { traversableToJSON } from './traversableToJSON';

/**
 * Parse a web stream representing an XML and emit objects
 */
export async function* parseStream(
  readableStream: ReadableStream,
  lookupTagName: string,
  options: StreamParseOptions = {},
) {
  options = { ...defaultOptions, ...options };

  for await (const traversableEntry of getTraversableGenerator(
    readableStream,
    lookupTagName,
    options,
  )) {
    yield traversableToJSON(traversableEntry, options);
  }
}

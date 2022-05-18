import { ReadableStream } from 'stream/web';

import { defaultOptions, ParseOptions } from './traversable/defaultOptions';
import { getTraversableGenerator } from './traversable/getTraversableGenerator';
import { traversableToJSON } from './traversableToJSON';

/**
 * Parse a web stream representing an XML and emit objects
 */
export async function* parseStream(
  readableStream: ReadableStream,
  options: ParseOptions = {},
) {
  options = { ...defaultOptions, ...options };

  for await (let entry of getTraversableGenerator(readableStream, options)) {
    const result = traversableToJSON(entry, options);

    console.log(result);
  }
}

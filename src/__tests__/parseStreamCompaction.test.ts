import { expect, test } from 'vitest';

import { parse } from '../parse.ts';
import { parseStream } from '../parseStream.ts';
import type { StreamParseOptions } from '../traversable/defaultOptions.ts';

const encoder = new TextEncoder();

function streamOf(bytes: Uint8Array, chunkSize: number) {
  let offset = 0;
  return new ReadableStream({
    pull(controller) {
      if (offset >= bytes.length) {
        controller.close();
        return;
      }
      controller.enqueue(bytes.subarray(offset, offset + chunkSize));
      offset += chunkSize;
    },
  });
}

/**
 * Collect every node named `tagName` from a full parse, so it can be compared
 * with what parseStream yields for the same document.
 * @param xml - the document.
 * @param tagName - the tag to collect.
 * @param options - parse options.
 * @returns the collected entries.
 */
function fromParse(xml: string, tagName: string, options: StreamParseOptions) {
  const found: unknown[] = [];
  (function walk(value: unknown) {
    if (value === null || typeof value !== 'object') return;
    for (const key in value) {
      const child = (value as Record<string, unknown>)[key];
      if (key === tagName) {
        if (Array.isArray(child)) found.push(...child);
        else found.push(child);
      }
      walk(child);
    }
  })(parse(encoder.encode(xml), options));
  return found;
}

async function fromStream(
  xml: string,
  tagName: string,
  options: StreamParseOptions,
  chunkSize: number,
) {
  const entries: unknown[] = [];
  for await (const entry of parseStream(
    streamOf(encoder.encode(xml), chunkSize),
    tagName,
    options,
  )) {
    entries.push(entry);
  }
  return entries;
}

// The buffer is compacted whenever it runs low, which shifts every offset the
// parser still holds. These use limits small enough to force that on tiny
// documents; at the defaults it only happens on very large streams.

test('text is read from the right offset after compaction', async () => {
  const xml =
    '<r><e><s>A</s></e><e><s>0123456789abcdefghijklmnopqrstuvwxyzABCD</s></e></r>';
  const options = { maxEntrySize: 8, maxBufferSize: 64 };
  const expected = fromParse(xml, 'e', options);

  expect(expected).toStrictEqual([
    { s: 'A' },
    { s: '0123456789abcdefghijklmnopqrstuvwxyzABCD' },
  ]);

  const results = await Promise.all(
    [1, 8, 4096].map((chunkSize) => fromStream(xml, 'e', options, chunkSize)),
  );

  for (const result of results) {
    expect(result).toStrictEqual(expected);
  }
});

test('text is not lost across compaction', async () => {
  let xml = '<r>';
  for (let index = 0; index < 12; index++) {
    xml += `<e id="${index}">v${index}</e>`;
  }
  xml += '</r>';
  const options = {
    ignoreAttributes: false,
    maxEntrySize: 32,
    maxBufferSize: 128,
  };
  const expected = fromParse(xml, 'e', options);

  expect(expected).toHaveLength(12);

  const results = await Promise.all(
    [1, 7, 4096].map((chunkSize) => fromStream(xml, 'e', options, chunkSize)),
  );

  for (const result of results) {
    expect(result).toStrictEqual(expected);
  }
});

test('stopNodes keep their bytes across compaction', async () => {
  let xml = '<root>';
  for (let index = 0; index < 8; index++) {
    xml += `<e><s><p>p${index}</p></s></e>`;
  }
  xml += '</root>';
  const options = {
    stopNodes: ['s'],
    maxEntrySize: 32,
    maxBufferSize: 96,
  };
  const expected = fromParse(xml, 'e', options);

  expect(expected[0]).toStrictEqual({ s: '<p>p0</p>' });

  const results = await Promise.all(
    [1, 8].map((chunkSize) => fromStream(xml, 'e', options, chunkSize)),
  );

  for (const result of results) {
    expect(result).toStrictEqual(expected);
  }
});

test('a long run between two matches does not exhaust the buffer', async () => {
  let xml = '<root><e>first</e>';
  for (let index = 0; index < 2000; index++) xml += `<x>${index}</x>`;
  xml += '<e>second</e></root>';
  const options = { maxEntrySize: 1000, maxBufferSize: 4000 };

  const results = await Promise.all(
    [1, 8, 512, 4096].map((chunkSize) =>
      fromStream(xml, 'e', options, chunkSize),
    ),
  );

  for (const result of results) {
    expect(result).toStrictEqual(['first', 'second']);
  }
});

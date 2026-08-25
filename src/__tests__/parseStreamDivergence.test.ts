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

async function fromStream(
  xml: string,
  tagName: string,
  options: StreamParseOptions = {},
) {
  const perChunkSize = await Promise.all(
    [1, 5, 4096].map(async (chunkSize) => {
      const entries: unknown[] = [];
      for await (const entry of parseStream(
        streamOf(encoder.encode(xml), chunkSize),
        tagName,
        options,
      )) {
        entries.push(entry);
      }
      return entries;
    }),
  );
  // every chunk size must agree; return the shared result
  for (const entries of perChunkSize) {
    expect(entries).toStrictEqual(perChunkSize[0]);
  }
  return perChunkSize[0];
}

test('yields self-closing elements that match the lookup tag', async () => {
  await expect(fromStream('<root><e/></root>', 'e')).resolves.toStrictEqual([
    '',
  ]);
  await expect(fromStream('<e/>', 'e')).resolves.toStrictEqual(['']);
  await expect(
    fromStream('<root><e a="1"/></root>', 'e', { ignoreAttributes: false }),
  ).resolves.toStrictEqual([{ $a: 1 }]);
});

test('does not drop a self-closing element from a sequence', async () => {
  const xml = '<root><e a="1"/><e a="2">t</e><e a="3"/></root>';
  const options = { ignoreAttributes: false };

  await expect(fromStream(xml, 'e', options)).resolves.toStrictEqual([
    { $a: 1 },
    { '#text': 't', $a: 2 },
    { $a: 3 },
  ]);
  expect(parse(encoder.encode(xml), options)).toStrictEqual({
    root: { e: [{ $a: 1 }, { '#text': 't', $a: 2 }, { $a: 3 }] },
  });
});

test('a stray closing tag does not throw', () => {
  // popping past the root used to leave currentNode undefined, so the next tag
  // threw a TypeError whose message depended on the options
  expect(parse(encoder.encode('</a><r>x</r>'))).toStrictEqual({ r: 'x' });
  expect(parse(encoder.encode('<r><a>x</a></r></r></r>'))).toStrictEqual({
    r: { a: 'x' },
  });
  expect(
    parse(encoder.encode('<r><a>x</a></r></r></r>'), { stopNodes: ['a'] }),
  ).toStrictEqual({ r: { a: 'x' } });
});

test('stopNodes covering an ancestor suppress the entries inside it', async () => {
  // parse() keeps the stop node's content as raw bytes, so the entries inside
  // it do not exist; the stream must not emit them either
  expect(
    parse(encoder.encode('<r><stop><e>1</e></stop></r>'), {
      stopNodes: ['stop'],
    }),
  ).toStrictEqual({ r: { stop: '<e>1</e>' } });
  await expect(
    fromStream('<r><stop><e>1</e></stop></r>', 'e', { stopNodes: ['stop'] }),
  ).resolves.toStrictEqual([]);
  await expect(
    fromStream('<r><stop><e>1</e></stop><e>2</e></r>', 'e', {
      stopNodes: ['stop'],
    }),
  ).resolves.toStrictEqual([2]);
  await expect(
    fromStream('<r><stop><stop><e>1</e></stop></stop><e>2</e></r>', 'e', {
      stopNodes: ['stop'],
    }),
  ).resolves.toStrictEqual([2]);
});

test('stopNodes on the lookup tag itself still yield', async () => {
  await expect(
    fromStream('<r><e><a>1</a></e></r>', 'e', { stopNodes: ['e'] }),
  ).resolves.toStrictEqual(['<a>1</a>']);
});

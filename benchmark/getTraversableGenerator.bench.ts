import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import Benchmark from 'benchmark';

import type { XMLNode } from '../src/XMLNode.ts';
import { defaultStreamOptions } from '../src/traversable/defaultOptions.ts';

import { getTraversableGeneratorByteLoop } from './variants/getTraversableGeneratorByteLoop.ts';
import { getTraversableGeneratorIndexOf } from './variants/getTraversableGeneratorIndexOf.ts';

// big.xml is not committed (360 MB); fall back to the committed small.xml.
const path = firstReadable(
  join(import.meta.dirname, 'big.xml'),
  join(import.meta.dirname, 'small.xml'),
);
const data = readFileSync(path);
const lookupTagName = 'spectrum';
const CHUNK_SIZE = 65536;

const options = {
  ...defaultStreamOptions,
  ignoreAttributes: false,
  tagValueProcessor: (value: Uint8Array) => value,
  attributeValueProcessor: (value: string) => value,
};

// The stream is served from memory so the measurement is parsing, not disk.
function streamOf(bytes: Uint8Array) {
  let offset = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (offset >= bytes.length) {
        controller.close();
        return;
      }
      controller.enqueue(bytes.subarray(offset, offset + CHUNK_SIZE));
      offset += CHUNK_SIZE;
    },
  });
}

type Generator = (
  stream: ReadableStream,
  tagName: string,
  options: typeof defaultStreamOptions,
) => AsyncGenerator<XMLNode>;

async function count(generator: Generator) {
  let entries = 0;
  for await (const entry of generator(streamOf(data), lookupTagName, options)) {
    if (entry) entries++;
  }
  return entries;
}

const byteLoop = () => count(getTraversableGeneratorByteLoop as Generator);
const indexOf = () => count(getTraversableGeneratorIndexOf as Generator);

console.log(`input: ${path} (${(data.length / 1e6).toFixed(1)} MB)`);
console.log(
  `<${lookupTagName}> entries — byteLoop: ${await byteLoop()}  indexOf: ${await indexOf()}`,
);

const BYTE_LOOP = 'getTraversableGenerator: per-byte JS loop';
const INDEX_OF = 'getTraversableGenerator: indexOf native scan';
const hz = new Map<string, number>();

new Benchmark.Suite()
  .add(BYTE_LOOP, {
    defer: true,
    minSamples: 12,
    fn: (deferred: { resolve: () => void }) => {
      void byteLoop().then(() => deferred.resolve());
    },
  })
  .add(INDEX_OF, {
    defer: true,
    minSamples: 12,
    fn: (deferred: { resolve: () => void }) => {
      void indexOf().then(() => deferred.resolve());
    },
  })
  .on('cycle', (event: Benchmark.Event) => {
    const bench = event.target as unknown as Benchmark;
    hz.set(bench.name ?? '', bench.hz);
    console.log(
      `${bench.name}: ${bench.hz.toFixed(3)} ops/s ±${bench.stats.rme.toFixed(2)}% ` +
        `(${bench.stats.sample.length} samples) — ${(1e3 / bench.hz).toFixed(1)} ms/run, ` +
        `${(1e9 / bench.hz / data.length).toFixed(2)} ns/input byte`,
    );
  })
  .on('complete', () => {
    const slow = hz.get(BYTE_LOOP);
    const fast = hz.get(INDEX_OF);
    if (slow && fast) console.log(`\nspeedup: ${(fast / slow).toFixed(2)}x`);
  })
  .run({ async: false });

function firstReadable(preferred: string, fallback: string) {
  try {
    readFileSync(preferred);
    return preferred;
  } catch {
    return fallback;
  }
}

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import Benchmark from 'benchmark';

import type { XMLNode } from '../src/XMLNode.ts';
import { defaultOptions } from '../src/traversable/defaultOptions.ts';

import { getTraversableByteLoop } from './variants/getTraversableByteLoop.ts';
import { getTraversableIndexOf } from './variants/getTraversableIndexOf.ts';

// big.xml is not committed (360 MB); fall back to the committed small.xml.
const path = firstReadable(
  join(import.meta.dirname, 'big.xml'),
  join(import.meta.dirname, 'small.xml'),
);
const data = readFileSync(path);

const options = {
  ...defaultOptions,
  ignoreAttributes: false,
  tagValueProcessor: (value: Uint8Array) => value,
  attributeValueProcessor: (value: string) => value,
};

function runByteLoop(input: Uint8Array) {
  return countNodes(getTraversableByteLoop(input, options));
}
function runIndexOf(input: Uint8Array) {
  return countNodes(getTraversableIndexOf(input, options));
}

console.log(`input: ${path} (${(data.length / 1e6).toFixed(1)} MB)`);
console.log(
  `nodes — byteLoop: ${runByteLoop(data)}  indexOf: ${runIndexOf(data)}`,
);

const BYTE_LOOP = 'getTraversable: per-byte JS loop';
const INDEX_OF = 'getTraversable: indexOf native scan';
const hz = new Map<string, number>();

new Benchmark.Suite()
  .add(BYTE_LOOP, () => runByteLoop(data), { minSamples: 12 })
  .add(INDEX_OF, () => runIndexOf(data), { minSamples: 12 })
  .on('cycle', (event: Benchmark.Event) => {
    const bench = event.target as unknown as Benchmark;
    hz.set(bench.name ?? '', bench.hz);
    const msPerRun = 1e3 / bench.hz;
    const nsPerByte = 1e9 / bench.hz / data.length;
    console.log(
      `${bench.name}: ${bench.hz.toFixed(3)} ops/s ±${bench.stats.rme.toFixed(2)}% ` +
        `(${bench.stats.sample.length} samples) — ${msPerRun.toFixed(1)} ms/run, ` +
        `${nsPerByte.toFixed(2)} ns/input byte`,
    );
  })
  .on('complete', () => {
    const slow = hz.get(BYTE_LOOP);
    const fast = hz.get(INDEX_OF);
    if (slow && fast) console.log(`\nspeedup: ${(fast / slow).toFixed(2)}x`);
  })
  .run({ async: false });

function countNodes(node: XMLNode): number {
  let count = 1;
  for (const tagName in node.children) {
    const children = node.children[tagName];
    if (!children) continue;
    for (const child of children) count += countNodes(child);
  }
  return count;
}

function firstReadable(preferred: string, fallback: string) {
  try {
    readFileSync(preferred);
    return preferred;
  } catch {
    return fallback;
  }
}

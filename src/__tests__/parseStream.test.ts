import { open } from 'fs/promises';
import { join } from 'path';
import { TransformStream } from 'stream/web';
import { parseStream } from '../parseStream';

describe('parseStream', () => {
  it('simple case', async () => {
    const file = await open(join(__dirname, 'assets/sample.xml'), 'r');
    const CHUNK_SIZE = 10;

    const transformStream = new TransformStream({
      start: function start() {}, // required.
      transform: async function transform(chunk, controller) {
        if (chunk === null) controller.terminate();
        chunk = new Uint8Array(await chunk);
        for (let i = 0; i < chunk.length; i += CHUNK_SIZE) {
          controller.enqueue(chunk.slice(i, CHUNK_SIZE));
        }
      },
    });

    //@ts-expect-error feature is too new
    const readableStream = file.readableWebStream();
    for await (let entry of parseStream(
      readableStream.pipeThrough(transformStream),
    )) {
      console.log(entry);
    }
  });
});

import { open } from 'fs/promises';
import { join } from 'path';

import { parseStream } from '../parseStream';

describe('parseStream', () => {
  it('simple case', async () => {
    // eslint-disable-next-line jest/no-if
    if (Number(process.versions.node.split('.')[0]) >= 18) {
      const file = await open(join(__dirname, 'assets/sample.xml'), 'r');
      const CHUNK_SIZE = 10;
      const transformStream = new TransformStream({
        start: function start() {}, // required.
        transform: async function transform(chunk, controller) {
          if (chunk === null) controller.terminate();
          chunk = new Uint8Array(await chunk);
          for (let i = 0; i < chunk.length; i += CHUNK_SIZE) {
            controller.enqueue(chunk.slice(i, i + CHUNK_SIZE));
          }
        },
      });

      const results = [];
      //@ts-expect-error feature is too new
      const readableStream = file.readableWebStream();
      for await (let entry of parseStream(
        readableStream.pipeThrough(transformStream),
        'address',
      )) {
        results.push(entry);
        //console.log(entry);
      }
      expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "buildingNo": 1,
          "city": "New York",
          "flatNo": 1,
          "street": "Park Ave",
        },
        Object {
          "buildingNo": 33,
          "city": "Boston",
          "flatNo": 24,
          "street": "Centre St",
        },
        Object {
          "buildingNo": 1,
          "city": "Moscow",
          "flatNo": 2,
          "street": "Kahovka",
        },
        Object {
          "buildingNo": 3,
          "city": "Tula",
          "flatNo": 78,
          "street": "Lenina",
        },
      ]
    `);
    }
  });
});

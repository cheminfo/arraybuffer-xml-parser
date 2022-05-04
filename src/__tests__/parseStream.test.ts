import { open } from 'fs/promises';
import { join } from 'path';

import { parseStream } from '../parseStream';

describe('parseStream', () => {
  it('simple case', async () => {
    const file = await open(join(__dirname, 'assets/sample.xml'), 'r');
    //@ts-expect-error feature is too new
    const readableStream = file.readableWebStream();
    for await (let entry of parseStream(readableStream)) {
      console.log(entry);
    }
  });
});

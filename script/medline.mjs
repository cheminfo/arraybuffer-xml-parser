import { open } from 'node:fs/promises';

import { parseStream } from '../lib/index.js';

/*
In order to test this script you should first build the package: `npm run prepack`
And you also need a (big) file from medline called 'medline.xml'
*/

const file = await open(new URL('medline.xml', import.meta.url), 'r');
const stream = file.readableWebStream();
let i = 0;
for await (const entry of parseStream(stream, 'PubmedArticle')) {
  console.log(entry);
  console.log(i++);
}

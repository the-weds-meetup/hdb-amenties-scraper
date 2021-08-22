import 'ts-polyfill/lib/es2019-array';

import { readStore, writeStore } from './output';
import hawkers from './sources/hawker';

import fs from 'fs';

try {
  fs.mkdirSync('traces');
} catch (e) {}

async function hawker() {
  try {
    const data = await hawkers();

    const store = readStore('hawker.json');
    writeStore('hawker.json', {
      hawker: data,
    });
  } catch (e) {
    console.log(e);
  }
}

async function scraper() {
  await hawker();
}

scraper()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

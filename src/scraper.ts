import 'ts-polyfill/lib/es2019-array';

import { writeStore, readStore } from './output';
import hawkers from './sources/hawker';
import basicCSV from './sources/basicCSV';

async function hawker() {
  try {
    const data = await hawkers();
    await writeStore('hawker.csv', 'raw', data);
  } catch (e) {
    console.log(e);
  }
}

async function postalCodes(fileName: string) {
  try {
    const rawData = await readStore(fileName);
    const data = await basicCSV(rawData);
    await writeStore(fileName, 'raw', data);
  } catch (e) {
    console.log(e);
  }
}

async function scraper() {
  await postalCodes('malls.csv');
}

scraper()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

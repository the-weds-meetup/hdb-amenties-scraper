import 'ts-polyfill/lib/es2019-array';

import { writeCSVStore } from './output';
import hawkers from './sources/hawker';

async function hawker() {
  try {
    const data = await hawkers();
    await writeCSVStore('hawker.csv', 'raw', data);
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

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
    console.log(`Received ${data.data.length} results from ${fileName}`);

    await writeStore(fileName, 'raw', data);
  } catch (e) {
    console.log(e);
  }
}

async function scraper() {
  await hawker();
  await postalCodes('malls.csv');
  await postalCodes('polyclinics.csv');
  await postalCodes('primary_school.csv');
  await postalCodes('sports_amenities.csv');
}

scraper()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

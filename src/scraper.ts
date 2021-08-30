import 'ts-polyfill/lib/es2019-array';

import { writeStore, readStore } from './output';
import hawkers from './sources/hawker';
import { processedPostalCode } from './sources/hdb';
import basicCSV from './sources/basicCSV';
import { HDBModifiedRaw } from './sources/hdb/model';
import { CSVRaw } from './sources/basicCSV/model';

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
    const rawData = await readStore<CSVRaw>(fileName);

    const data = await basicCSV(rawData);
    console.log(`Received ${data.data.length} results from ${fileName}`);

    await writeStore(fileName, 'raw', data);
  } catch (e) {
    console.log(e);
  }
}

async function getHdb() {
  try {
    const rawData = await readStore<HDBModifiedRaw>(
      'Resale_Price_Modified.csv'
    );
    const data = await processedPostalCode(rawData);
    await writeStore('hdb_modified_address.csv', 'raw', data);
  } catch (e) {
    console.log(e);
  }
}

async function scraper() {
  // await hawker();
  // await getHdb();
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

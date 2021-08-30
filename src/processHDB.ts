import 'ts-polyfill/lib/es2019-array';

import { writeStore, readStore } from './output';
import { processDistance } from './sources/hdb';
import { CSVRaw } from './sources/basicCSV/model';
import { HDBComparision } from './sources/hdb/model';

async function loadData() {
  try {
    const hdb = await readStore<CSVRaw>('hdb_modified_address.csv', true);

    const hawker = await readStore<CSVRaw>('hawker.csv', true);
    const transport = await readStore<CSVRaw>('mrt.csv', true);
    const malls = await readStore<CSVRaw>('malls.csv', true);
    const polyclinics = await readStore<CSVRaw>('polyclinics.csv', true);
    const primarySchool = await readStore<CSVRaw>('primary_school.csv', true);
    const sports = await readStore<CSVRaw>('sports_amenities.csv', true);

    return {
      hdb,
      hawker,
      transport,
      malls,
      polyclinics,
      primarySchool,
      sports,
    };
  } catch (e) {
    console.log(e);
  }
}

async function processData() {
  const data = await loadData();
  const results = processDistance(data);
  await writeStore<HDBComparision>('hdb_distance.csv', 'processed', results);
}

processData()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

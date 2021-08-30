import autoLocation from '../../util/autoLocation';
import { HDBModifiedRaw, HDB } from './model';
import { cleanupAddress, sleep } from './utils';
import { uniqBy } from 'lodash';

interface HDBProcessed {
  header: { id: string; title: string }[];
  data: HDB[];
}

const loggingKey = '[HDB ADDRESSES]';
const ONE_MAP_LIMIT = 250;
const CSV_HEADER = [
  { id: 'id', title: 'ID' },
  { id: 'name', title: 'NAME' },
  { id: 'address', title: 'ADDRESS' },
  { id: 'postalCode', title: 'POSTAL_CODE' },
  { id: 'longitude', title: 'LONGITUDE' },
  { id: 'latitude', title: 'LATITUDE' },
];

export default async function hdbProcessing(
  data: HDBModifiedRaw[]
): Promise<HDBProcessed> {
  const results: HDB[] = [];
  let count = 0;

  const uniqueData = uniqBy(data, (hdb) => {
    return hdb['Address'];
  });

  console.time(loggingKey);
  for await (const tempData of uniqueData) {
    count++;

    const cleanedAddress = cleanupAddress(tempData['Address']);
    const coords = await autoLocation<{ address: string }>({
      address: cleanedAddress,
    });

    if (!coords?.location) {
      console.log(`${cleanedAddress} is invalid`);
    }

    results.push({
      id: `${count}`,
      name: cleanedAddress,
      address: cleanedAddress,
      postalCode: coords?.location?.postal || '',
      longitude: `${coords?.location?.coordinates[0]}` || '',
      latitude: `${coords?.location?.coordinates[1]}` || '',
    });

    // Avoid errors when max OneMap api calls is reached by waiting
    // Prevents wait if we are at the last tempData in array
    if (count % ONE_MAP_LIMIT === 0 && data.length != count) {
      console.timeLog(loggingKey);
      console.log(
        `Fetched ${results.length} / ${uniqueData.length} HDB addresses so far`
      );
      await sleep(20 * 1000); // pause for 20 seconds
    }
  }

  console.timeEnd(loggingKey);
  console.log(`Fetched ${results.length} HDB addresses`);

  return { header: CSV_HEADER, data: results };
}

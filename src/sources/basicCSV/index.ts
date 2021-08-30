import autoLocation from '../../util/autoLocation';
import { CSVRaw, CSV } from './model';

interface CSVProcessed {
  header: { id: string; title: string }[];
  data: CSV[];
}

const CSV_HEADER = [
  { id: 'id', title: 'ID' },
  { id: 'name', title: 'NAME' },
  { id: 'address', title: 'ADDRESS' },
  { id: 'postalCode', title: 'POSTAL_CODE' },
  { id: 'longitude', title: 'LONGITUDE' },
  { id: 'latitude', title: 'LATITUDE' },
];

export default async function csvProcessing(
  data: CSVRaw[]
): Promise<CSVProcessed> {
  const results = [];

  for await (const tempData of data) {
    const postal = tempData['POSTAL_CODE'];
    const coords = await autoLocation<{ address: string }>({ address: postal });

    if (!coords?.location) {
      console.log(`(${postal}) ${tempData['NAME']} is invalid`);
    }

    results.push({
      id: tempData['ID'],
      name: tempData['NAME'],
      address: tempData['ADDRESS'],
      postalCode: postal,
      longitude: coords?.location?.coordinates[0] || '',
      latitude: coords?.location?.coordinates[1] || '',
    });
  }

  return { header: CSV_HEADER, data: results };
}

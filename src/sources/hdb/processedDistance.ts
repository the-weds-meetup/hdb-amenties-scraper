import { getDistance } from 'geolib';
import { minBy } from 'lodash';
import { CSVRaw } from '../basicCSV/model';
import { HDBComparision } from './model';

interface HDBProcessed {
  header: { id: string; title: string }[];
  data: HDBComparision[];
}

interface Props {
  hdb: CSVRaw[];
  hawker: CSVRaw[];
  malls: CSVRaw[];
  polyclinics: CSVRaw[];
  primarySchool: CSVRaw[];
  sports: CSVRaw[];
  transport: CSVRaw[];
}

const loggingKey = '[HDB SHORTEST]';
const RAFFLES_PLACE_MRT = { longitude: 103.8514617, latitude: 1.28412561 };
const CSV_HEADER = [
  { id: 'id', title: 'ID' },
  { id: 'name', title: 'NAME' },
  { id: 'address', title: 'ADDRESS' },
  { id: 'postalCode', title: 'POSTAL_CODE' },
  { id: 'longitude', title: 'LONGITUDE' },
  { id: 'latitude', title: 'LATITUDE' },

  { id: 'nearestHawkerName', title: 'HAWKER_NAME' },
  { id: 'nearestHawkerAddress', title: 'HAWKER_ADDRESS' },
  { id: 'nearestHawkerDistance', title: 'HAWKER_DISTANCE_METERS' },

  { id: 'nearestTransportName', title: 'TRANSPORT_NAME' },
  { id: 'nearestTransportAddress', title: 'TRANSPORT_ADDRESS' },
  { id: 'nearestTransportDistance', title: 'TRANSPORT_DISTANCE_METERS' },

  { id: 'nearestMallName', title: 'MALL_NAME' },
  { id: 'nearestMallAddress', title: 'MALL_ADDRESS' },
  { id: 'nearestMallDistance', title: 'MALL_DISTANCE_METERS' },

  { id: 'nearestPolyclinicName', title: 'POLYCLINIC_NAME' },
  { id: 'nearestPolyclinicAddress', title: 'POLYCLINIC_ADDRESS' },
  { id: 'nearestPolyclinicDistance', title: 'POLYCLINIC_DISTANCE_METERS' },

  { id: 'nearestSchoolName', title: 'PRIMARY_SCHOOL_NAME' },
  { id: 'nearestSchoolAddress', title: 'PRIMARY_SCHOOL_ADDRESS' },
  { id: 'nearestSchoolDistance', title: 'PRIMARY_SCHOOL_METERS' },

  { id: 'nearestSportsName', title: 'SPORTS_NAME' },
  { id: 'nearestSportsAddress', title: 'SPORTS_ADDRESS' },
  { id: 'nearestSportsDistance', title: 'SPORTS_DISTANCE' },

  { id: 'distanceFromCBD', title: 'CBD_DISTANCE_METERS' },
];

function getShortestDistance(hdb: CSVRaw, amenities: CSVRaw[]) {
  const shortest = minBy(amenities, (amenity) => {
    const distance = getDistance(
      {
        latitude: hdb['LATITUDE'],
        longitude: hdb['LONGITUDE'],
      },
      {
        latitude: amenity['LATITUDE'],
        longitude: amenity['LONGITUDE'],
      }
    );
    return distance;
  });

  const distance = getDistance(
    {
      latitude: hdb['LATITUDE'],
      longitude: hdb['LONGITUDE'],
    },
    {
      latitude: shortest['LATITUDE'],
      longitude: shortest['LONGITUDE'],
    }
  );

  return {
    name: shortest['NAME'],
    address: shortest['ADDRESS'],
    distance: distance,
  };
}

function getCBDDistance(hdb: CSVRaw) {
  const distance = getDistance(
    {
      latitude: hdb['LATITUDE'],
      longitude: hdb['LONGITUDE'],
    },
    RAFFLES_PLACE_MRT
  );
  return distance;
}

export default function hdbProcessing(data: Props): HDBProcessed {
  const { hdb, hawker, transport, malls, polyclinics, primarySchool, sports } =
    data;
  const results: HDBComparision[] = [];
  console.time(loggingKey);

  for (const currentHDB of hdb) {
    const shortestHawker = getShortestDistance(currentHDB, hawker);
    const shortestTransport = getShortestDistance(currentHDB, transport);
    const shortestMalls = getShortestDistance(currentHDB, malls);
    const shortestPolyclinics = getShortestDistance(currentHDB, polyclinics);
    const shortestPrimarySchool = getShortestDistance(
      currentHDB,
      primarySchool
    );
    const shortestSports = getShortestDistance(currentHDB, sports);

    const cbdDistance = getCBDDistance(currentHDB);

    results.push({
      id: currentHDB['ID'],
      name: currentHDB['NAME'],
      address: currentHDB['ADDRESS'],
      postalCode: currentHDB['POSTAL_CODE'],
      longitude: currentHDB['LONGITUDE'],
      latitude: currentHDB['LATITUDE'],

      nearestHawkerName: `${shortestHawker.name}`,
      nearestHawkerAddress: `${shortestHawker.address}`,
      nearestHawkerDistance: `${shortestHawker.distance}`,

      nearestTransportName: `${shortestTransport.name}`,
      nearestTransportAddress: `${shortestTransport.address}`,
      nearestTransportDistance: `${shortestTransport.distance}`,

      nearestMallName: `${shortestMalls.name}`,
      nearestMallAddress: `${shortestMalls.address}`,
      nearestMallDistance: `${shortestMalls.distance}`,

      nearestPolyclinicName: `${shortestPolyclinics.name}`,
      nearestPolyclinicAddress: `${shortestPolyclinics.address}`,
      nearestPolyclinicDistance: `${shortestPolyclinics.distance}`,

      nearestSchoolName: `${shortestPrimarySchool.name}`,
      nearestSchoolAddress: `${shortestPrimarySchool.address}`,
      nearestSchoolDistance: `${shortestPrimarySchool.distance}`,

      nearestSportsName: `${shortestSports.name}`,
      nearestSportsAddress: `${shortestSports.address}`,
      nearestSportsDistance: `${shortestSports.distance}`,
      distanceFromCBD: `${cbdDistance}`,
    });
  }
  console.timeEnd(loggingKey);
  console.log(`Process ${results.length} results`);

  return { header: CSV_HEADER, data: results };
}

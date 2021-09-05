import { CSV } from '../basicCSV/model';

export interface HDBModifiedRaw {
  [key: string]: string;
  'Town Index': string;
  'Months Elapsed': string;
  'Flat Type': string;
  'Storey Index': string;
  Address: string;
  'Floor Area (Sqm)': string;
  'Flat Model': string;
  'Remaining Lease(years)': string;
  'Actual Price (SGD)': string;
}

export type HDB = CSV;

export interface HDBComparision extends CSV {
  distanceFromCBD: string;
  nearestHawkerName: string;
  nearestHawkerAddress: string;
  nearestHawkerDistance: string;
  nearestTransportName: string;
  nearestTransportAddress: string;
  nearestTransportDistance: string;
  nearestMallName: string;
  nearestMallAddress: string;
  nearestMallDistance: string;
  nearestPolyclinicName: string;
  nearestPolyclinicAddress: string;
  nearestPolyclinicDistance: string;
  nearestSchoolName: string;
  nearestSchoolAddress: string;
  nearestSchoolDistance: string;
  nearestSportsName: string;
  nearestSportsAddress: string;
  nearestSportsDistance: string;
}

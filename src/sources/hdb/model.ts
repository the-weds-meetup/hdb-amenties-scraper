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

export interface CSVRaw {
  [key: string]: string;
  'No.': string;
  Name: string;
  Location: string;
  'Postal Code': string;
  Longitude: string;
  Latitude: string;
}

export interface CSV {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  longitude: string;
  latitude: string;
}

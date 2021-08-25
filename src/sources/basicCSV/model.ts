export interface CSVRaw {
  [key: string]: string;
  ID: string;
  NAME: string;
  ADDRESS: string;
  POSTAL_CODE: string;
  LONGITUDE: string;
  LATITUDE: string;
}

export interface CSV {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  longitude: string;
  latitude: string;
}

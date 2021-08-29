import axios from 'axios';
import querystring from 'querystring';

const BASE_URL = 'https://developers.onemap.sg';

export interface Response {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: Result[];
}

export interface Result {
  SEARCHVAL: string;
  X: string;
  Y: string;
  POSTAL: string;
  LATITUDE: string;
  LONGITUDE: string;
  LONGTITUDE: string;
}

/**
 * Search using Onemap.sg
 */
export default async function search(term: string): Promise<Response> {
  const query = {
    searchVal: term,
    returnGeom: 'Y',
    getAddrDetails: 'Y',
    pageNum: '1',
  };
  const response = await axios.get(
    `${BASE_URL}/commonapi/search?${querystring.stringify(query)}`,
    {
      responseType: 'json',
    }
  );
  return response.data;
}

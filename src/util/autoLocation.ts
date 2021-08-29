import lookupLocation from '../location/lookup';
import postalCode from './postalCode';

interface Location {
  type: string;
  postal: string;
  coordinates: number[];
}

/**
 * Helper function to automatically set a place's address
 * to its OneMap lookup address
 */
export default async function autoLocation<T>(
  obj: T & { address: string }
): Promise<T & { address: string; location: Location | null }> {
  const addressLookup = await lookupLocation(
    postalCode(obj.address) || obj.address
  );
  return Object.assign(obj, {
    location:
      addressLookup?.results?.length !== 0
        ? {
            type: 'Point',
            postal: addressLookup.results[0].POSTAL,
            coordinates: [
              parseFloat(addressLookup.results[0].LONGTITUDE),
              parseFloat(addressLookup.results[0].LATITUDE),
            ],
          }
        : null,
  });
}

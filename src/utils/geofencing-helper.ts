/**
 *
 * We are using 'Meter' as the distance unit,
 * 'Minute' as the time unit
 *
 */

import getDistanceAsync from './google-distance-matrix';
type GetDistanceAsyncResult = number | '';

// const METER_PER_MINUTE = (50 * 1000) / 60;

type HaversineCoordinates = [number, number] | number[];

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

const getHaversineDistance = async (
  pos1: HaversineCoordinates,
  pos2: HaversineCoordinates,
): Promise<number> => {
  const [lat1, lon1] = pos1,
    [lat2, lon2] = pos2;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Promise.resolve(d * 1000); // distance to meters
};

const getGoogleMatrixDistance = async <
  T = HaversineCoordinates | HaversineCoordinates[]
>(
  pos1: T,
  pos2: T,
): Promise<GetDistanceAsyncResult> => {
  const [lat1, lon1] = (pos1 as unknown) as [number, number],
    [lat2, lon2] = (pos2 as unknown) as [number, number];

  // return new Promise(async (resolve, reject) => {
  let distanceRes: GetDistanceAsyncResult = '';
  try {
    distanceRes = await getDistanceAsync({
      origin: `${lat1},${lon1}`,
      destination: `${lat2},${lon2}`,
    });

    if (!distanceRes) {
      distanceRes = ((await getHaversineDistance(
        (pos1 as unknown) as HaversineCoordinates,
        (pos2 as unknown) as HaversineCoordinates,
      )) as unknown) as GetDistanceAsyncResult;
    }
  } catch (e) {
    console.log('getGoogleMatrixDistance e', e);
  }

  // return resolve(distanceRes);
  return distanceRes;

  // ,
  // function (err, data) {
  //   if (err) {
  //     console.log('getGoogleMatrixDistance err', err)
  //     return reject({ errMessage: err.message, err: err })
  //   }
  //   console.log('getGoogleMatrixDistance', data);
  //   return resolve(data);
  // });
};

const getDistanceBetweenCoordsAsync = __DEV__
  ? getHaversineDistance
  : getGoogleMatrixDistance;
// const getDistanceBetweenCoordsAsync = getGoogleMatrixDistance;

export { getHaversineDistance, getDistanceBetweenCoordsAsync };

export default getHaversineDistance;

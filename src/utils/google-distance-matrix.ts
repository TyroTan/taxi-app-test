import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';

type Param = {
  origin: string;
  destination: string;
};

const get = async ({ origin, destination }: Param): Promise<any> => {
  const qs = `origins=${origin}&destinations=${destination}`;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${qs}&key=${GOOGLE_MAPS_API_KEY}`;

  // console.log('urlurl', url)

  return fetch(url);
};

interface MatrixResult {
  status: 'OK';
  rows: [
    {
      elements: [
        {
          distance: {
            value: number;
          };
          status: 'OK';
        },
      ];
    },
  ];
}

type GetDistanceAsyncResult = number | '';

const getDistanceAsync = async (p: Param): Promise<GetDistanceAsyncResult> => {
  try {
    const data = await get(p);

    if (data?.status === 200) {
      const d = (await data.json()) as MatrixResult;
      const meters = (d?.rows?.[0]?.elements?.[0]?.distance?.value ??
        '') as GetDistanceAsyncResult;
      return meters;
    }
  } catch (e) {
    console.log('getDistanceAsync e', e);
  }

  return '';
};

export default getDistanceAsync;
export { get, getDistanceAsync };

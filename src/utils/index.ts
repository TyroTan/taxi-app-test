import { moderateScale } from 'react-native-size-matters';
import { getStatusBarHeight, isIphoneX } from 'react-native-iphone-x-helper';
import { PixelRatio, Platform, Share, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AxiosError } from 'axios';
import { getVersion } from 'react-native-device-info';
import {
  UserData,
  UserDataUser,
  ValidateUSPhoneNumber,
  Place,
  WrappedSetPlaceType,
  INavigation,
  Filter,
} from '../..';
import { defaultEmptyCurrentUser } from '../state_manager';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { signupValidatePOST } from '../services/backend';
import { AsYouType } from 'libphonenumber-js';
import { CountryCode, PhoneNumber } from 'libphonenumber-js/types';
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile';
import Geolocation, {
  GeoCoordinates,
  GeoPosition,
} from 'react-native-geolocation-service';
import getHaversineDistance, {
  getDistanceBetweenCoordsAsync,
} from './geofencing-helper';
import {
  check,
  // PERMISSIONS,
  RESULTS,
  request,
  Permission,
  PERMISSIONS,
} from 'react-native-permissions';
import { ERROR_500_MSG, HEIGHT_WINDOW, WIDTH_WINDOW } from './constants';

const scale = moderateScale;
// const bulletUni = '\u2022';

const dark = '#38032e';
const light = '#FFF';
const green = '#54a56e';
const orange = '#f56416';
const orangeLight = '#E49335';
const blue = '#10bccc';
const blueFB = '#475993';

const primaryPalette = {
  dark,
  light,
  green,
  orange,
  orangeLight,
  blue,
  blueFB,
};

const getCaughtAxiosErrorMessage = (e: AxiosError): string => {
  return e && e.response && e.response.data && e.response.data.message
    ? e.response.data.message
    : '';
};

const getStringOrFirstElement = (param1?: string | string[]): string => {
  return Array.isArray(param1 as string[])
    ? param1?.[0]?.length ?? 0 > 2
      ? param1?.[0] ?? ''
      : ''
    : (param1 as string) ?? '';
};

const getDjangoModelErrorMessage = (e: AxiosError): string => {
  let message = '';
  try {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const errorObj = getCaughtAxiosErrorObj(e);
    if (errorObj) {
      const keys = Object.keys(errorObj);
      keys.forEach(key => {
        // console.log('heyhey ', key, errorObj, errorObj[key]);
        message = message ? message : getStringOrFirstElement(errorObj[key]);
      });
    }

    return message && message.length > 2 ? message : ERROR_500_MSG;
  } catch (err) {
    console.log('getDjangoModelErrorMessage e', err);
    return ERROR_500_MSG;
  }
};

const getARHeightByWidth = (ar: [number, number], width: number): number => {
  return (width * ar[1]) / ar[0];
};

const getFilenameFromAbsolute = (path = ''): string => {
  return path.split('/').pop() as string;
};

const getThumbnailSource = (
  place: Place,
): null | {
  uri: string;
} => {
  const { image = '' } = place;
  if (!image) {
    return null;
  }
  try {
    const splitted = image.split('.');
    const { length } = splitted;
    const ext = splitted[length - 1];

    const photoName = splitted.reduce((acc, cur, idx): string => {
      if (idx === length - 1) {
        return acc;
      } else if (idx === 0) {
        return cur;
      }

      acc = `${acc}.${cur}`;
      return acc;
    }, '');

    return {
      uri: `${photoName}_thumb.${ext}`,
    }; // _thumb is added by django
  } catch (e) {
    return null;
  }
};

// interface ObjOfStrings {
//   [key: string]: string
// }

interface ObjOfStrings2level {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const getCaughtAxiosErrorObj = (e: AxiosError): ObjOfStrings2level => {
  const defaultError = {} as { [key: string]: string };
  return e?.response?.data ?? defaultError;
};

const getAlertIfStringNetworkError = (errorString: string): string | false => {
  const networkErrorMsg =
    'Please check your internet connectivity and try again.';
  return new RegExp('NETWORK_ERROR|Network Error', 'gi').test(errorString)
    ? networkErrorMsg
    : false;
};

const isIphoneScreenWidthSmall = (): boolean => {
  const pixelRatio = PixelRatio.get();

  if (pixelRatio < 3 && !isIphoneX()) {
    return true;
  }

  return false;
};

const graphRequestGetEmailAsync = async (): Promise<string> => {
  const promisified = new Promise<string>((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        parameters: {
          fields: {
            string: 'email',
          },
        },
      },
      (
        e: { message: string } | null,
        data: {
          email: string;
        },
      ): void => {
        if (e) {
          return reject(e);
        }
        resolve(data?.email ?? '');
      },
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  });

  return promisified;
};

const setCurrentSession = async (data: string | UserData): Promise<void> => {
  try {
    if (typeof data === 'string') {
      return AsyncStorage.setItem('userData', data);
    }

    return AsyncStorage.setItem('userData', JSON.stringify(data));
  } catch (e) {
    console.log('setCurrentSession error:', e);
  }
};

const isEmailRegisteredAsync = async (email: string): Promise<boolean> => {
  try {
    await signupValidatePOST({
      data: {
        email,
      },
    });

    return false;
  } catch (e) {
    const eObj = getCaughtAxiosErrorObj(e);
    if (eObj?.email?.[0]) {
      return true;
    }
    return false;
  }
};

const getCurrentSession = async (
  setUserData?: (val: UserData) => void,
): Promise<UserData> => {
  const userData: UserData = defaultEmptyCurrentUser;
  try {
    const item = await AsyncStorage.getItem('userData');
    if (item) {
      const jsoned = (JSON.parse(
        (item as unknown) as string,
      ) as unknown) as UserData;
      if (typeof setUserData === 'function') {
        setUserData(jsoned);
      }

      return jsoned;
    }

    if (typeof setUserData === 'function') {
      setUserData(userData as UserData);
    }
  } catch (e) {
    console.log('getCurrentSession e', e);
    throw e;
  }
  return userData as UserData;
};

const getMappedGender = (
  text: 'Other' | 'Male' | 'Female',
): 'O' | 'M' | 'F' => {
  switch (text) {
    case 'Other':
      return 'O';
    case 'Male':
      return 'M';
    case 'Female':
      return 'F';
  }
};

const getMappedGenderLabel = (
  text: 'O' | 'M' | 'F',
): 'Other' | 'Male' | 'Female' => {
  switch (text) {
    case 'O':
      return 'Other';
    case 'M':
      return 'Male';
    case 'F':
      return 'Female';
  }
};

// "key": "47c2da7587892524552469d73f0186c7b486fd84",
//     "id": 11,
//     "name": null,
//     "email": "tyro@crowdbotics.com",
//     "gender": "O",
//     "dob": "2000-01-01",
//     "phone_number": "",
//     "otp": ""

const isProfileInfoComplete = (props: Partial<UserDataUser>): boolean => {
  return (
    (props?.key?.length ?? 0) > 10 &&
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    emailValidator(props?.email ?? '') &&
    !!props.name?.length &&
    !!props.gender?.length &&
    !!props?.phone_number?.length
  );
};

const validateUSPhoneNumber = (
  number: string,
  defaultCountry?: CountryCode,
): ValidateUSPhoneNumber | undefined => {
  const INVALID_US_NUMBER_ERROR = 'Invalid US Number';
  const res = parsePhoneNumberFromString(
    number.replace(/[^0-9]/g, ''),
    defaultCountry ? defaultCountry : 'US',
  ) as PhoneNumber;

  if (__DEV__) {
    if (number.substring(0, 3) === '+63' && number.length === 13) {
      return ({
        country: 'PH',
        number: number,
        valid: true,
      } as unknown) as ValidateUSPhoneNumber;
    }
  }

  if (!res) {
    return ({
      country: '',
      number: '',
      valid: false,
      errorMsg: INVALID_US_NUMBER_ERROR,
    } as unknown) as ValidateUSPhoneNumber;
  }

  return {
    country: res.country,
    number: res.number,
    valid: res.isValid(),
    errorMsg: res.isValid() ? '' : INVALID_US_NUMBER_ERROR,
    isValid: res.isValid,
    nationalNumber: res.nationalNumber,
    formatNational: res.formatNational,
    formatInternational: res.formatInternational,
    format: res.format,
    getURI: res.getURI,
    getType: res.getType,

    countryCallingCode: res.countryCallingCode,
    isPossible: res.isPossible,
  };
};

const resultValues = Object.values(RESULTS);
type PermissionResults = typeof resultValues[number];

const getPermissionAsync = async (props: {
  type: Permission;
}): Promise<PermissionResults> => {
  return check(props.type).then(resThen => {
    if (resThen !== 'granted') {
      return request(props.type as Permission);
    }

    return Promise.resolve(RESULTS.GRANTED);
  });
};

const getCurrentPositionAsync = async <
  T = GeoCoordinates | GeoPosition
>(): Promise<T> => {
  if (__DEV__) {
    const jj = {
      coords: {
        accuracy: 5,
        altitude: 0,
        altitudeAccuracy: -1,
        heading: -1,
        latitude: 50.4501,
        longitude: 30.5234,
        speed: -1,
      },
      timestamp: 1582698710624.731,
    };
    return jj;
  }
  // assumes we alredy have permission
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        // const jj = {
        //   coords: {
        //     accuracy: 5,
        //     altitude: 0,
        //     altitudeAccuracy: -1,
        //     heading: -1,
        //     latitude: 50.4386558,
        //     longitude: 30.6127095,
        //     speed: -1,
        //   },
        //   timestamp: 1582698710624.731,
        // };
        return resolve((position as unknown) as T);
      },
      error => {
        return reject({
          code: error.code,
          message: error.message,
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
};

const appendDistancesAsync = async (
  places: Place[],
  coords: GeoPosition['coords'],
  forceHaversine: boolean,
): Promise<Place[]> => {
  const newPlaces: Place[] = [];
  // return new Promise((resolve, reject) => {
  for (const place of places) {
    const newPlace = { ...(place as Place) };
    try {
      let dAsyncResult = 0;
      if (forceHaversine === true) {
        dAsyncResult = await getHaversineDistance(
          [parseFloat(newPlace.lat), parseFloat(newPlace.long)],
          [coords.latitude, coords.longitude],
        );
      } else {
        dAsyncResult = (await getDistanceBetweenCoordsAsync(
          [parseFloat(newPlace.lat), parseFloat(newPlace.long)],
          [coords.latitude, coords.longitude],
        )) as number;
      }

      if (dAsyncResult) {
        newPlace.distance = dAsyncResult;
      }
    } catch (e) {
      console.log('getDistanceBetweenCoordsAsync e', e);
    }

    newPlaces.push(newPlace);
  }

  // return resolve(newPlaces);
  // });

  return newPlaces;
};

const withAskAndAppendDistance = (
  setPlaces: WrappedSetPlaceType,
  currentGeoCoordinates: GeoCoordinates,
  setCurrentGeoCoordinates: (coord: GeoCoordinates) => void,
  forceHaversine: boolean,
): WrappedSetPlaceType => {
  const wrapped: WrappedSetPlaceType = async (
    places: Place[],
  ): Promise<void> => {
    let hadPermission = false;

    /* if (__DEV__) {
      const jj = {
        coords: {
          accuracy: 5,
          altitude: 0,
          altitudeAccuracy: -1,
          heading: -1,
          latitude: 50.4386558,
          longitude: 30.6127095,
          speed: -1,
        },
        timestamp: 1582698710624.731,
      };
      const newPlaces = await appendDistancesAsync(places, jj.coords);
      // console.log('newPlaces', newPlaces.map(np => np.distance));
      await setPlaces(newPlaces);
      return;
    } */

    /* only ios asks location permission per rnmaps? */
    if (Platform.OS === 'android') {
      hadPermission =
        (await getPermissionAsync({
          type: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        })) === 'granted';
    } else {
      hadPermission =
        (await getPermissionAsync({
          type: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        })) === 'granted';
    }

    if (!hadPermission) {
      await setPlaces(places);
      return;
    }

    const geoPosition = await getCurrentPositionAsync<GeoPosition>();
    if (geoPosition?.coords?.latitude) {
      await setCurrentGeoCoordinates({
        ...currentGeoCoordinates,
        latitude: geoPosition.coords.latitude,
        longitude: geoPosition.coords.longitude,
      });
      const newPlaces = await appendDistancesAsync(
        places,
        geoPosition.coords,
        forceHaversine,
      );
      await setPlaces(newPlaces);
    }
  };

  return wrapped;
};

const emailValidator = (val: string): boolean => {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    val,
  );
};

const onShare = async (): Promise<void> => {
  try {
    const result = await Share.share({
      message: `Hi! I use Dollarback to... Download it free and share with friends at ${
        Platform.OS === 'android'
          ? 'https://rebrand.ly/123'
          : 'https://rebrand.ly/123'
      }`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

const isNumeric = (n: string | number): boolean => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const isIpadUnsafe = (): boolean => {
  const aspectRatio = HEIGHT_WINDOW / WIDTH_WINDOW;

  return aspectRatio > 1.6 ? false : true;
};
const isIpad = isIpadUnsafe;

const getAndroidScale = (): number => {
  const aspectRatio = HEIGHT_WINDOW / WIDTH_WINDOW;
  const pixelRatio = PixelRatio.get();
  const A_RATIO_CONSTANT = 1.89,
    P_RATIO_CONSTANT = 2.65;
  // console.log('pixelRatio', pixelRatio, aspectRatio);

  if (Platform.OS !== 'android') return 1;
  const ADiff = A_RATIO_CONSTANT - aspectRatio,
    PDiff = P_RATIO_CONSTANT - pixelRatio;

  if (ADiff > 0 && PDiff > 0) {
    // console.log('scale is', (10 - (ADiff + PDiff) / 2) / 10);
    return (10 - (ADiff + PDiff) / 2) / 10;
  } else {
    return 1;
  }
};

const getVersionText = (): string => {
  return `${getVersion()}`;
};

const getPlacesSortHash = (places: Place[]): string =>
  places.reduce((acc, cur) => {
    const identifier = `${cur.id}/${cur?.distance ?? -1}`;
    return `${identifier}-${acc}`;
  }, '');

const getDistanceText = (meter?: string | number): string => {
  if (meter === 0) {
    return '0';
  } else if (meter === '' || typeof meter === 'undefined' || meter < 0) {
    return '';
  }

  const m = Math.round(meter as number) as number;
  if (!m) {
    return '0';
  }

  const km = Math.round(m * 100) / 100 / 1000;

  return km >= 1 ? `${Math.round(km)} km` : `${m} m`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatUSPhone = (text: string, prev: string): string => {
  const cleaned = text?.replace(/[^\d+ ]/g, '') ?? '';
  const formatted = new AsYouType('US').input(cleaned);
  const formal = formatted.replace(/[^\d+ ]/g, '');
  const isValidWith1 = validateUSPhoneNumber(`+1 ${formal}`)?.valid === true;
  const isStillValidWithoutPrefix =
    validateUSPhoneNumber(`${formal}`)?.valid === true;

  if (isValidWith1 === true || isStillValidWithoutPrefix === true) {
    if (
      formal?.[0] === '+' &&
      formal?.[1] === '1' &&
      validateUSPhoneNumber(`${formal.slice(2, formal.length)}`)?.valid === true
    ) {
      return `${formal.slice(2, formal.length).trim()}`;
    } else if (
      formal?.[0] === '1' &&
      validateUSPhoneNumber(`${formal.slice(1, formal.length)}`)?.valid === true
    ) {
      return `${formal.slice(1, formal.length).trim()}`;
    }
  }

  return formal.trim();
};

const formatSSN = (value: string, prev?: string): string => {
  // `AAA-BB-CCCC`
  const onlyNumRE = /[^\d]/g;
  const numOnly = value.replace(onlyNumRE, '');

  // case 3 - backspace
  if (value === prev?.substring(0, prev?.length - 1)) {
    // then a dash is "backspaced"
    if (prev.substring(prev.length - 1) === '-') {
      const result = numOnly.split('').reduce((acc, cur, i) => {
        if (i === 2 || i === 4) {
          return acc + cur + '-';
        }
        return acc + cur;
      }, '');

      return result.substring(0, result.length - 1);
    }
  }

  return numOnly.split('').reduce((acc, cur, i) => {
    if (i === 2 || i === 4) {
      return acc + cur + '-';
    }
    return acc + cur;
  }, '');
};

interface PlaceWithNav extends Place {
  navigate: INavigation['navigation']['navigate'];
}
type FilterListBySearch = (
  list: Place[],
  filter: Filter,
  navigate: INavigation['navigation']['navigate'],
  getPlacesSortedByDeals: (places: Place[]) => Place[],
  searchText?: string,
) => PlaceWithNav[];

const filterPlaceList: FilterListBySearch = (
  list: Place[],
  filter: Filter,
  navigate: INavigation['navigation']['navigate'],
  getPlacesSortedByDeals: (places: Place[]) => Place[],
  searchText?: string,
): PlaceWithNav[] => {
  let newList: PlaceWithNav[] = [];
  if (filter === 'best-deals') {
    newList = getPlacesSortedByDeals(
      list
        .filter(item => {
          return (item?.distance ?? 80001) <= 80001;
        })
        .map(place => ({
          ...place,
          navigate,
        })),
    ) as PlaceWithNav[];
  } else {
    newList = [
      ...list
        .sort((a, b) => ((a?.distance ?? -1) > (b?.distance ?? -1) ? 1 : -1))
        .map(place => ({
          ...place,
          navigate,
        })),
    ];
  }

  if (!searchText) return newList;

  const searchTextWords = searchText.split(' ');

  return newList.filter(place => {
    const placeWords = place?.name?.split(' ');
    return searchTextWords.reduce((acc: boolean, cur: string) => {
      return acc === true
        ? true
        : (placeWords?.findIndex?.(name => name.toLowerCase() === cur) ?? -1) >
            -1;
    }, false);
  });
};

export {
  primaryPalette,
  setCurrentSession,
  getCurrentSession,
  getVersionText,
  getCaughtAxiosErrorMessage,
  getCaughtAxiosErrorObj,
  getDjangoModelErrorMessage,
  getAlertIfStringNetworkError,
  isIphoneScreenWidthSmall,
  scale,
  getStatusBarHeight,
  graphRequestGetEmailAsync,
  getMappedGender,
  getMappedGenderLabel,
  isEmailRegisteredAsync,
  emailValidator,
  validateUSPhoneNumber,
  isProfileInfoComplete,
  getARHeightByWidth,
  getThumbnailSource,
  getFilenameFromAbsolute,
  getCurrentPositionAsync,
  getPermissionAsync,
  appendDistancesAsync,
  withAskAndAppendDistance,
  isNumeric,
  onShare,
  getPlacesSortHash,
  isIpad,
  getAndroidScale,
  getDistanceText,
  formatSSN,
  formatUSPhone,
  filterPlaceList,
  // debounce
};

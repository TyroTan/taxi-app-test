import React from 'reactn';
const { setGlobal } = React;
import { UserData, Place, PlaceDeal, Filter, ProductIAP } from '../..';

// const empty = {
//   jwtAccessToken: '',
//   user: {
//     email: '',
//     carDetails: []
//   }
// };

// const defaultCategoryFilter = {
//   description: 'FEATURED',
//   photo: '',
// } as Category;

// const defaultCategories = [] as Category[];
// const defaultBusinesses = [] as Business[];
// const defaultNotifcationRecord = {} as NotificationRecord;
const emptyObj = {};
const defaultEmptyCurrentUser: UserData = {
  token: '',
  user: {
    key: '',
    id: -1,
    name: null,
    email: '',
    gender: 'O',
    dob: '',
    phone_number: '',
    otp: '',
  },
};

const defaultCurrentGeoCoordinates = {
  latitude: 40.7132735,
  longitude: -74.0074258,
  latitudeDelta: 0.002,
  longitudeDelta: 0.002,
};

const initialGlobalState = {
  currentUser: defaultEmptyCurrentUser,
  places: ([] as unknown) as Place[],
  placeDeal: ([] as unknown) as PlaceDeal[],
  currentGeoCoordinates: defaultCurrentGeoCoordinates,
  isInitialDataFetched: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentForm: emptyObj as any,
  currentNavigationPopupMessage: '',
  currentFilter: 'near-me' as Filter,
  productsIAP: [] as ProductIAP[],
};

const initSetGlobal = (): void => {
  setGlobal(initialGlobalState);
};

export { defaultEmptyCurrentUser, initSetGlobal };

import 'reactn';
import { AxiosResponse } from 'axios';
import {
  NavigationState,
  NavigationScreenProp,
  NavigationParams,
} from 'react-navigation';

import { PhoneNumber } from 'libphonenumber-js/types';
import { GeoCoordinates } from 'react-native-geolocation-service';
import { ImagePickerResponse } from 'react-native-image-picker';
import { Product } from 'react-native-iap';

declare module 'reactn/default' {
  export interface Reducers {
    // setUserData: (
    //   global: State,
    //   dispatch: Dispatch,
    //   userData: {
    //     type: 'SET';
    //     payload: IUserData;
    //   }
    // ) => Pick<State, 'userData'>;
    // doNothing: (
    //   global: State,
    //   dispatch: Dispatch,
    // ) => null;
  }

  export interface State {
    currentUser: UserData;
    currentGeoCoordinates: GeoCoordinates;
    places: Place[];
    placeDeal: PlaceDeal[];
    isInitialDataFetched: boolean;
    currentForm: {};
    currentNavigationPopupMessage: string;
    currentFilter: Filter;
    productsIAP: ProductIAP[];
  }
}

interface INavigation<T extends NavigationParams = {}> {
  navigation: NavigationScreenProp<NavigationState & { routeName?: string }, T>;
}

type ProfileTypes = 'gmail' | 'fb' | 'login-gmail' | 'edit-profile';

interface ProfilePropsNavigationState {
  type?: ProfileTypes;
  socialUser?: Partial<UserDataUser>;
  email?: string;
}

interface IBackendFactory {
  timeout: number;
  csrf: string;
}

type IHeaders = any;

interface IBackendFactoryRequest {
  timeout: number;
  headers: IHeaders;
  baseUrl?: string;
}

interface IRequest {
  resource: string;
  Authorization?: string;
}

interface IRequestGET<T = {}> {
  query?: T;
  params?: T;
}

interface IRequestPOST<T> {
  data: T;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraHeaders?: any;
}

type APIResponse<T extends { data?: any }> = T & {
  success?: boolean;
  message?: string;
} & AxiosResponse<Pick<T, 'data'>>;

interface IRequestAxiosGET extends IRequest, IRequestGET {}

interface IRequestAxiosPOST<T = {}> extends IRequest, IRequestPOST<T> {}
interface UserDataUser {
  key: string;
  id: number;
  name: string | null;
  email: string;
  gender: 'O' | 'M' | 'F';
  dob: string;
  phone_number: string;
  otp: string;
  image?: string;
  subscription_valid_until?: string;
}

interface UserData {
  token: string;
  user: UserDataUser;
}

interface ImagePickerResponseWithImageSource extends ImagePickerResponse {
  imageSource?: string;
}

interface Place {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  lat: string;
  long: string;
  image: string;
  thumbnail: string;
  created: string;
  distance?: number;
}

interface PlaceDeal {
  id: number;
  title: string;
  description: string;
  discount_percentage: number;
  created: string;
  premium_only: boolean;
  is_active: boolean;
  place: number;
}

interface Check {
  id: number;
  total_amount: string;
  discount_amount: string;
  image: string;
  comment: string;
  status: string;
  created: string;
  deal: number;
  user: number;
}

interface CheckResponse {
  cash_out: number;
  comment: string;
  created: string;
  deal: number;
  deal_title: string;
  discount_amount: string;
  image: string;
  status: string;
  total_amount: string;
  user: number;
}

interface CameraTakePicture {
  height: number;
  uri: string;
  width: number;
  type?: string; // on android?
}

type CheckPostData = Partial<Check> & {
  image: CameraTakePicture;
};

type UserPatchBody = Partial<
  | UserDataUser
  | {
      image: ImagePickerResponse;
    }
>;
interface CashOutPOSTData {
  user: number;
  first_name: string;
  last_name: string;
  ssn: string;
  address: string;
  state: string;
  amount: number;
  message?: string;
}

type TrackCheckItemStatus = 'R' | 'C' | 'D';
interface TrackCheckItem {
  cash_out?: number | string;
  comment: string;
  created: string;
  deal: number;
  discount_amount: string;
  id: number;
  image: string;
  status: TrackCheckItemStatus;
  total_amount: string;
  user: number;
}

interface CashOutItem {
  id: number;
  first_name: string;
  last_name: string;
  ssn: string;
  address: string;
  state: string;
  amount: string;
  status: TrackCheckItemStatus;
  created: string;
  user: number;
}

interface ValidateUSPhoneNumber extends PhoneNumber {
  valid: boolean;
  country?: any;
  errorMsg: string;
}

interface SSOUserData {
  ssoType: 'google' | 'fb';
  jwtAccessToken: string;
  idToken: string;
  refreshToken: string;
  user: Partial<UserDataUser>;
}
interface SSOResponse extends SSOUserData {
  cancelled?: boolean;
  type: string;
}

type HomeSwitchRouteNames = 'HomeMap' | 'PlaceList';

interface NavigationVerifyAccountParam {
  profileType?: ProfileTypes;
  name: string;
  email: string;
  password: string;
  dob: string;
  gender: 'Other' | 'Male' | 'Female';
}

interface NavigationVerificationCodeParam extends NavigationVerifyAccountParam {
  code: string;
  phoneNumber: string;
}

type USAStates = {
  [key: string]: string;
};

type Filter = 'near-me' | 'best-deals';

type ProductIAP = Product;

type WrappedSetPlaceType = (currentValue: Place[]) => Promise<void>;

interface CurrentMapRegion {
  regionCenteteredPlaceId: number;
  region: Partial<GeoCoordinates>;
}

/**
 *
 * CUSTOM UTILS
 *
 **/

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

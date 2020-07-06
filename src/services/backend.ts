import { sendGet, sendPost, sendPatch } from './BackendFactory';
import {
  IRequestGET,
  IRequestPOST,
  UserDataUser,
  Place,
  PlaceDeal,
  Check,
  CheckResponse,
  CameraTakePicture,
  CheckPostData,
  UserPatchBody,
  TrackCheckItem,
  CashOutItem,
  CashOutPOSTData,
} from '../..';
import { Platform } from 'react-native';
import { ImagePickerResponse } from 'react-native-image-picker';
import { getFilenameFromAbsolute } from '../utils';
// import { AxiosResponse } from 'axios';

interface PaginatedResponse<T> {
  count: number;
  previous: number | null;
  next: number | null;
  results: T[];
}

export function loginPOST(
  opts: IRequestPOST<{
    email: string;
    password: string;
  }>,
): Promise<UserDataUser> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendPost({
    resource: `rest-auth/login/`,
    ...opts,
  });
}

export function signupPOST(
  opts: IRequestPOST<{
    email: string;
    password1: string;
    password2: string;
    name: string;
    gender: string;
    phone_number: string;
    dob: string;
    otp: string;
  }>,
): Promise<UserDataUser> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendPost({
    resource: `rest-auth/registration/`,
    ...opts,
  });
}

export function socialFacebookAuthPOST(
  opts: IRequestPOST<{
    access_token: string;
  }>,
): Promise<UserDataUser> {
  return sendPost({
    resource: `rest-auth/facebook/`,
    ...opts,
  });
}

export function socialGoogleAuthPOST(
  opts: IRequestPOST<{
    access_token: string;
  }>,
): Promise<UserDataUser> {
  return sendPost({
    resource: `rest-auth/google/`,
    ...opts,
  });
}

export function changePasswordPOST(
  opts: IRequestPOST<{
    new_password1: string;
    new_password2: string;
    old_password: string;
  }>,
): Promise<{
  detail?: string;
}> {
  return sendPost({
    resource: `rest-auth/password/change/`,
    ...opts,
  });
}

export function editProfilePATCH(
  opts: IRequestPOST<Partial<UserDataUser>>,
): Promise<UserDataUser> {
  if (!opts.data.id) {
    throw Error('missing user id');
  }

  const { id: user_id, ...rest } = opts.data as UserDataUser;
  opts.data = rest;

  return sendPatch({
    resource: `api/users/${user_id}/`,
    ...opts,
  });
}

export function forgotPasswordPOST(
  opts: IRequestPOST<{
    email: string;
  }>,
): Promise<{
  detail: string;
}> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendPost({
    resource: `rest-auth/password/reset/`,
    ...opts,
  });
}

export function signupValidatePOST(
  opts: IRequestPOST<
    Partial<{
      email: string;
      password1: string;
      password2: string;
      name: string;
      gender: string;
      dob: string;
      phone_number?: string;
      otp?: string;
    }>
  >,
): Promise<{ [key: string]: string }> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendPost({
    resource: `rest-auth/registration/`,
    ...opts,
  });
}

export function getOTPPOST(
  opts: IRequestPOST<{
    phone_number: string;
  }>,
): Promise<string> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendPost({
    resource: `api/get-otp/`,
    ...opts,
  });
}

export function placesGET(opts?: IRequestGET): Promise<Place[]> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendGet({
    resource: `api/places/`,
    ...opts,
  });
}

export function dealsGET(opts?: IRequestGET): Promise<PlaceDeal[]> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendGet({
    resource: `api/deals/`,
    ...opts,
  });
}

export function earningsGET(
  opts?: IRequestGET,
): Promise<{
  available_earnings: string;
  available_earnings_numeric: number;
}> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendGet({
    resource: `api/available-earnings/`,
    ...opts,
  });
}

export function trackCheckGET(
  opts?: IRequestGET<{
    user: number;
  }>,
): Promise<TrackCheckItem[]> {
  if (!opts?.query?.user) {
    throw Error('missing user id');
  }

  return sendGet({
    resource: `api/checks/`,
    ...opts,
  });
}

export function cashOutGET(
  opts?: IRequestGET<{
    user: number;
  }>,
): Promise<CashOutItem[]> {
  if (!opts?.query?.user) {
    throw Error('missing user id');
  }

  return sendGet({
    resource: `api/cash-out/`,
    ...opts,
  });
}

export function cashOutPOST(
  opts: IRequestPOST<CashOutPOSTData>,
): Promise<CashOutPOSTData> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendPost({
    resource: `api/cash-out/`,
    ...opts,
  });
}

export function profilePATCH(
  opts: IRequestPOST<Partial<UserPatchBody>>,
): Promise<UserDataUser> {
  if (!(opts.data as UserDataUser).id) {
    throw Error('missing user id');
  }

  const { id: user_id, ...rest } = opts.data as UserDataUser;

  if (opts && opts.data && opts.data.image) {
    const extraParams = rest;

    const photoObj: ImagePickerResponse = opts.data
      .image as ImagePickerResponse;
    const params = new FormData();

    let type: string = photoObj?.type ?? '',
      uri = photoObj.uri.replace('file://', '');
    if (Platform.OS === 'android') {
      type = `${photoObj.type}/${photoObj.uri.split('.').pop()}`;
      uri = photoObj.uri;
    }

    params.append('image', {
      uri: uri,
      type: type,
      name: getFilenameFromAbsolute(uri),
    });

    Object.keys(extraParams).forEach((eachkey: string) => {
      const key = eachkey as keyof UserPatchBody;
      if (key === 'image') {
        return;
      }

      params.append(key, extraParams[key]);
    });

    opts.data = (params as unknown) as UserPatchBody;
  }

  return sendPatch({
    resource: `api/users/${user_id}/`,
    ...opts,
  });
}

export function checksPOST(
  opts: IRequestPOST<CheckPostData>,
): Promise<CheckResponse> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  // return sendPost({
  //   resource: `api/checks/`,
  //   ...opts,
  // });

  if (opts && opts.data && opts.data.image) {
    const extraParams = opts.data;
    const photoObj: CameraTakePicture = opts.data.image;
    const params = new FormData();

    let type: string = photoObj?.type ?? '',
      uri = photoObj.uri.replace('file://', '');
    if (Platform.OS === 'android') {
      type = `${photoObj.type}/${photoObj.uri.split('.').pop()}`;
      uri = photoObj.uri;
    }

    params.append('image', {
      uri: uri,
      type: type,
      name: getFilenameFromAbsolute(uri),
    });

    Object.keys(extraParams).forEach((eachkey: string) => {
      const key = eachkey as keyof CheckPostData;
      if (key === 'image') {
        return;
      }

      params.append(key, extraParams[key]);
    });

    opts.data = (params as unknown) as CheckPostData;
  }

  return sendPost<CheckResponse>({
    resource: `api/checks/`,
    ...opts,
  });
}

interface FilteredCheck {
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

export function checksGET<R = Check[] | FilteredCheck[]>(
  opts?: IRequestGET<{
    deal: number;
  }>,
): Promise<R> {
  // console.log('axioss!', `${API_URL}/auth/login/`, opts.data);
  // return axios.post(`${API_URL}/auth/login/`, opts.data);
  return sendGet({
    resource: `api/checks/`,
    ...opts,
  });
}

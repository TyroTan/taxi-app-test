import queryString from 'query-string';
import { API_URL } from './services.config';
import { getCurrentSession, getVersionText } from '../utils';

import axios from 'axios';
import {
  IBackendFactoryRequest,
  IBackendFactory,
  IHeaders,
  IRequestAxiosGET,
  IRequestAxiosPOST,
  APIResponse,
} from '../../index';

const empty = {};

const TOKEN_AUTH_PREFIX = `Token `;
export default class BackendFactory {
  public req: IBackendFactoryRequest;
  public constructor(opts = empty as IBackendFactory) {
    const { timeout = 25000 } = opts;
    const headers: IHeaders = {};

    // if (csrf) {
    //   headers._csrf = csrf;
    // }

    this.req = {
      timeout,
      headers,
    };
  }

  public getRequest<R>(options: IRequestAxiosGET): Promise<APIResponse<R>> {
    const { resource = '', query = null, Authorization = '' } = options;
    this.req.baseUrl = `${API_URL}/${resource}`;
    this.req.headers['Custom-Appversion'] = getVersionText();

    if (Authorization) {
      this.req.headers.Authorization = `${TOKEN_AUTH_PREFIX}${Authorization}`;
    }

    // console.log('osow!', query);
    const queryUrl = query ? queryString.stringify(query) : '';

    const queryUrlFull = queryUrl ? `?${queryUrl}` : '';

    // console.log(
    //   `${this.req.baseUrl}${queryUrlFull}`,
    //   'getRequest this.req',
    //   queryUrlFull,
    // );

    return axios
      .create(this.req)
      .get(`${this.req.baseUrl}${queryUrlFull}`)
      .then(res => res.data);
  }

  public postRequest<R>(options: IRequestAxiosPOST): Promise<APIResponse<R>> {
    const { resource = '', data, Authorization = '' } = options;
    this.req.baseUrl = `${API_URL}/${resource}`;
    this.req.headers['Content-Type'] = 'application/json';
    // this.req.headers.accept = 'application/json';

    if (Authorization) {
      this.req.headers.Authorization = `${TOKEN_AUTH_PREFIX}${Authorization}`;
    }

    // console.log('postRequest this.req', this.req.baseUrl, data);

    return axios
      .create(this.req)
      .post(this.req.baseUrl, data)
      .then(res => {
        return res.data;
      });

    // return axio.create(this.req)
    // .post(this.req.baseUrl, data)
    // return axios
    // .post('https://qa.trovoai.com/api/v1/auth/login/', JSON.stringify(data), {
    // 'Content-Type': 'application/json',
    // })
    // .then(res => {
    // console.log('res.data!', res.data);
    // return res.data;
    // });
  }

  public putRequest<R>(options: IRequestAxiosPOST): Promise<APIResponse<R>> {
    const { resource = '', data, Authorization = '' } = options;
    this.req.baseUrl = `${API_URL}/${resource}`;
    this.req.headers['Custom-Appversion'] = getVersionText();

    if (Authorization) {
      this.req.headers.Authorization = `${TOKEN_AUTH_PREFIX}${Authorization}`;
    }

    // console.log(
    //   'PUTRequest this.req',
    //   this.req,
    //   this.req.baseUrl,
    //   data,
    //   options
    // );

    return axios
      .create(this.req)
      .put(this.req.baseUrl, data)
      .then(res => {
        return res.data;
      });
  }

  public deleteRequest<R>(options: IRequestAxiosPOST): Promise<APIResponse<R>> {
    const { resource = '', Authorization = '' } = options;
    this.req.baseUrl = `${API_URL}/${resource}`;
    this.req.headers['Custom-Appversion'] = getVersionText();

    if (Authorization) {
      this.req.headers.Authorization = `${TOKEN_AUTH_PREFIX}${Authorization}`;
    }

    // console.log('DELETERequest this.req', this.req, this.req.baseUrl, options);

    return axios
      .create(this.req)
      .delete(this.req.baseUrl)
      .then(res => {
        return res.data;
      });
  }

  public patchRequest<R>(options: IRequestAxiosPOST): Promise<APIResponse<R>> {
    const {
      resource = '',
      data,
      extraHeaders = null,
      Authorization = '',
    } = options;
    this.req.baseUrl = `${API_URL}/${resource}`;
    this.req.headers['Custom-Appversion'] = getVersionText();

    if (Authorization) {
      this.req.headers.Authorization = `${TOKEN_AUTH_PREFIX}${Authorization}`;
    }
    if (extraHeaders) {
      Object.keys(extraHeaders).forEach(header => {
        // whitelist other headers here
        if (header === 'Content-Type') {
          this.req.headers[header] = `${extraHeaders[header]}`;
        }
      });
    }

    // console.log('patchinn', this.req, data);

    return axios
      .create(this.req)
      .patch(this.req.baseUrl, data)
      .then(res => {
        return res.data;
      });
  }

  public PatchFileUpload<R>(
    options: IRequestAxiosPOST,
  ): Promise<APIResponse<R>> {
    const { resource = '', data, Authorization = '' } = options;

    const headers = {
      'Custom-Appversion': getVersionText(),
      Authorization: `${TOKEN_AUTH_PREFIX}${Authorization}`,
    };

    return fetch(`${API_URL}/${resource}`, {
      headers,
      method: 'PATCH',
      body: data,
    })
      .then(response => {
        if (!(response.status >= 200 && response.status <= 299)) {
          throw Error('400');
        }
        return response.json();
      })
      .catch(error => {
        console.log(`performRequestFileUpload ${resource + ' PATCH'}`, error);
        throw error;
      });
  }

  /*
  putRequest(options = {}) {}

  optionRequest(options = {}) {}
  
  */
}

const bf = new BackendFactory();

export async function sendGet<T>(
  Obj: IRequestAxiosGET,
): Promise<APIResponse<T>> {
  const authed = await getCurrentSession();
  let moreOptions = Obj;
  if (authed && authed.token) {
    moreOptions = {
      ...moreOptions,
      Authorization: `${authed.token}`,
    };
  }

  return bf.getRequest(moreOptions);
}

export async function sendPost<T>(
  Obj: IRequestAxiosPOST,
): Promise<APIResponse<T>> {
  const authed = await getCurrentSession();

  let moreOptions = Obj;
  if (authed && authed.token) {
    moreOptions = {
      ...moreOptions,
      Authorization: `${authed.token}`,
    };
  }

  return bf.postRequest<T>(moreOptions);
}

export async function sendNoAuthPost<T>(
  Obj: IRequestAxiosPOST,
): Promise<APIResponse<T>> {
  return bf.postRequest(Obj);
}

export async function sendNoAuthGet<T>(
  Obj: IRequestAxiosGET,
): Promise<APIResponse<T>> {
  return bf.getRequest(Obj);
}

export async function sendPut<T>(
  putObj: IRequestAxiosPOST,
): Promise<APIResponse<T>> {
  const authed = await getCurrentSession();
  let moreOptions = putObj;
  if (authed && authed.token) {
    moreOptions = {
      ...moreOptions,
      Authorization: `${authed.token}`,
    };
  }

  return bf.putRequest<T>(moreOptions);
}

export async function sendDelete<T>(delObj: {}): Promise<APIResponse<T>> {
  const authed = await getCurrentSession();
  let moreOptions = delObj;
  if (authed && authed.token) {
    moreOptions = {
      ...moreOptions,
      Authorization: `${authed.token}`,
    };
  }

  return bf.deleteRequest<T>(moreOptions);
}

export function sendPatch<R>(Obj: IRequestAxiosPOST): Promise<APIResponse<R>> {
  return bf.patchRequest<R>(Obj);
}

/* export function sendDelete(Obj) {
  return bf.deleteRequest(Obj);
}


export function sendOption(Obj) {
  return bf.optionRequest(Obj);
} */

import { API_URL_PROD_ENV, API_URL_DEV_ENV } from 'react-native-dotenv';

const config = {
  API_URL_PROD: API_URL_PROD_ENV,
  API_URL_DEV: API_URL_DEV_ENV,

  /* eslint-disable-next-line no-undef */
  // API_URL: __DEV__ ? API_URL_DEV_ENV : API_URL_PROD_ENV,
  API_URL: API_URL_PROD_ENV,
  // API_URL: `https://qa.trovoai.com/api/v1`,
};

const { API_URL_PROD, API_URL_DEV, API_URL } = config;

export { API_URL_PROD, API_URL_DEV, API_URL };

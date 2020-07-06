import { Dimensions } from 'react-native';

const DIM = Dimensions.get('window');
const WIDTH_WINDOW = DIM.width;
const HEIGHT_WINDOW = DIM.height;
const ASYNC_STORAGE_KEY_NOTIFICATION_RECORD =
  'ASYNC_STORAGE_KEY_NOTIFICATION_RECORD';
const ASYNC_STORAGE_KEY_BUSINESS_TO_OPEN = 'ASYNC_STORAGE_KEY_BUSINESS_TO_OPEN';

const MAX_IMAGE_WIDTH = 768;
const MAX_HEADER_IMAGE_WIDTH =
  WIDTH_WINDOW > MAX_IMAGE_WIDTH ? MAX_IMAGE_WIDTH : WIDTH_WINDOW * 0.8;

const ERROR_500_MSG = 'Cannot process the request for now.';
const ASPECT_RATIO_MAIN_IMG: [number, number] = [430, 260];
const ASYNC_STORAGE_KEY_SESSION = 'ASYNC_STORAGE_KEY_SESSION';

const DATE_FORMAT_STRING = 'MM/DD/YYYY';

export {
  ASYNC_STORAGE_KEY_SESSION,
  DIM,
  ERROR_500_MSG,
  WIDTH_WINDOW,
  HEIGHT_WINDOW,
  MAX_HEADER_IMAGE_WIDTH,
  MAX_IMAGE_WIDTH,
  ASPECT_RATIO_MAIN_IMG,
  ASYNC_STORAGE_KEY_NOTIFICATION_RECORD,
  ASYNC_STORAGE_KEY_BUSINESS_TO_OPEN,
  DATE_FORMAT_STRING,
};

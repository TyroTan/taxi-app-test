import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.mock('react-native-device-info', () => {
  return {
    getUniqueID: jest.fn(),
  };
});

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
}));

jest.mock('react-native-permissions', () => ({
  RESULTS: {},
  check: jest.fn(),
}));


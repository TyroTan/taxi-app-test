import { getDistanceText, formatSSN, formatUSPhone } from '../src/utils';

test('getDistanceText 1', () => {
  const fn = getDistanceText;
  const distance1 = '';

  expect(fn()).toEqual('');
  expect(fn(distance1)).toEqual('');
  expect(fn(0)).toEqual('0');

  const distance2 = -1;
  expect(fn(distance2)).toEqual('');
  expect(fn(0.45)).toEqual('0');
});

test('getDistanceText 2', () => {
  const fn = getDistanceText;
  const distance1 = 10000 * 1000;
  expect(fn(distance1)).toEqual('10000 km');
  expect(fn(1000 * 1000)).toEqual('1000 km');

  const distance2 = 999;
  expect(fn(distance2)).toEqual('999 m');
  expect(fn(1)).toEqual('1 m');

  expect(fn(8989.567)).toEqual('9 km');
  expect(fn(10401.567)).toEqual('10 km');
  expect(fn(435.567)).toEqual('436 m');
});

test('formatSSN 1 - copy paste', () => {
  const fn = formatSSN;
  const s1 = '123-12-1234';
  const s2 = '123a-12(-1234';
  const s3 = '123121234-';
  const s4 = '123-12-1234a';
  const s5 = '12-312-1234';
  const s6 = '12-12-1234';
  const s7 = '1231-21-234';

  expect(fn('-')).toEqual('');
  expect(fn('-aAJ23')).toEqual('23');
  expect(fn('123-12-1234')).toEqual(s1);
  expect(fn(s2)).toEqual(s1);
  expect(fn(s3)).toEqual(s1);
  expect(fn(s4)).toEqual(s1);
  expect(fn(s5)).toEqual(s1);
  expect(fn(s6)).toEqual('121-21-234');
  expect(fn(s7)).toEqual(s1);
  expect(fn('12-312-123-')).toEqual('123-12-123');
});

test('formatSSN 2 - as you type', () => {
  const fn = formatSSN;
  const s1 = '123-12-123';
  const s2 = '123-1';
  const s3 = '123-12';
  const s4 = '123-12-';

  expect(fn(s1)).toEqual(s1);
  expect(fn('1')).toEqual('1');
  expect(fn('123a')).toEqual('123-');
  expect(fn(s2)).toEqual(s2);
  expect(fn(s3)).toEqual(s3 + '-');
  expect(fn('123-12-a')).toEqual('123-12-');
  expect(fn(s4)).toEqual(s4);
  expect(fn('123-12-1-')).toEqual('123-12-1');
});

test('formatSSN 3 - backspace', () => {
  const fn = formatSSN;
  const s1Prev = '123-12-1234';
  const s1 = '123-12-123';

  const s2Prev = '123-12-123';
  const s2 = '123-12-12';

  const s3Prev = '123-12-1';
  const s3 = '123-12-';

  const s4Prev = '123-12-';
  const s4 = '123-12';

  const s5Prev = '123-1';
  const s5 = '123-';

  const s6Prev = '123-';
  const s6 = '123';

  expect(fn(s1, s1Prev)).toEqual(s1);
  expect(fn(s2, s2Prev)).toEqual(s2);
  expect(fn(s3, s3Prev)).toEqual(s3);
  expect(fn(s4, s4Prev)).toEqual(s4);
  expect(fn(s5, s5Prev)).toEqual(s5);
  expect(fn(s6, s6Prev)).toEqual(s6);
});

test.only('formatUSPhone With 1 or +1 country code ', () => {
  const fn = formatUSPhone;
  const s1 = '+1  234-567AA8901';
  const s2 = '+12342543210';
  const s3 = '+1 234 254 2222';
  const s4 = '+1 (501) (254)-2929';
  const s5 = '12345678901';
  const s6 = '12345678B901';

  expect(fn(s1, '')).toEqual('234 567 8901');
  expect(fn(s2, '')).toEqual('234 254 3210');
  expect(fn(s3, '')).toEqual('234 254 2222');
  expect(fn(s4, '')).toEqual('501 254 2929');
  expect(fn(s5, '')).toEqual('234 5678901');
  expect(fn(s6, '')).toEqual('234 5678901');
});

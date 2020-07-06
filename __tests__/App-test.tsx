import { isNumeric } from "../src/utils";

test('isNumeric', () => {
  const string1 = '';
  const string2 = '$12.2';
  const obj1 = {};
  const obj2 = new Number('2342.23423');

  expect(isNumeric(string1)).toEqual(false);
  expect(isNumeric(string2)).toEqual(false);
  expect(isNumeric(obj1)).toEqual(false);
  expect(isNumeric(obj2)).toEqual(true);
});

test('isNumeric 2', () => {
  const string1 = '';
  const string2 = '$12.2';
  const string3 = '12213';
  const string4 = '124123.421.2'
  const string5 = '1221.2353';
  const string6 = '-1221.2353';
  const string7 = '-0.0';
  const obj1 = {};
  const obj2 = NaN;
  const bool = !NaN;
  const num1 = 12211
  const num2 = 2342.2342;
  const num3 = -2342.2342;


  expect(isNumeric(string1)).toEqual(false);
  expect(isNumeric(string2)).toEqual(false);

  expect(isNumeric(string3)).toEqual(true);

  expect(isNumeric(string4)).toEqual(false);

  expect(isNumeric(string5)).toEqual(true);

  expect(isNumeric(string6)).toEqual(true);
  expect(isNumeric(string7)).toEqual(true);

  expect(isNumeric(obj1)).toEqual(false);
  expect(isNumeric(obj2)).toEqual(false);
  expect(isNumeric(bool)).toEqual(false);

  expect(isNumeric(num1)).toEqual(true);
  expect(isNumeric(num2)).toEqual(true);
  expect(isNumeric(num3)).toEqual(true);

})
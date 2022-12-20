import { ECMA_STRING_TAG } from '../constant';

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path) => reg.test(path);

export const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

type ECMAType = keyof typeof ECMA_STRING_TAG;

const checkECMAType = (value: any, type: ECMAType) => {
  return Object.prototype.toString.call(value) === ECMA_STRING_TAG[type];
};

export const isError = (value: any) => {
  return checkECMAType(value, 'error');
};

export const isFunction = (value: any) => {
  return checkECMAType(value, 'function');
};

export const isArray = (value: any) => {
  return Array.isArray(value);
};

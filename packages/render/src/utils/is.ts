import { ECMA_STRING_TAG } from './constant';

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
  return checkECMAType(value, 'array');
};

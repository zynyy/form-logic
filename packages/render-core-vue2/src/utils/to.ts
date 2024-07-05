import { isObject } from 'lodash-es';

export const toArray = <T>(arr: T | readonly T[]): T[] => {
  if (arr === undefined || arr === null) {
    return [];
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[];
};

export const dashToDotValue = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map((item) => {
      return dashToDotValue(item);
    });
  }
  if (isObject(value)) {
    const nextValue: any = {};
    Object.entries(value).forEach(([key, val]) => {
      nextValue[dashToDot(key)] = dashToDotValue(val);
    });
    return nextValue;
  }

  return value;
};

export const dotToDashValue = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map((item) => {
      return dotToDashValue(item);
    });
  }
  if (isObject(value)) {
    const nextValue: any = {};
    Object.entries(value).forEach(([key, val]) => {
      nextValue[dotToDash(key)] = dotToDashValue(val);
    });
    return nextValue;
  }

  return value;
};

export const dotToDash = (code?: string) => {
  return code ? code.replaceAll('.', '-') : '';
};

export const dashToDot = (code?: string) => {
  return code ? code.replaceAll('-', '.') : '';
};

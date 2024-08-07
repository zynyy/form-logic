import { globalThisPolyfill } from './globalThisPolyfill';
import { isFn, isStr } from './types';
export const instOf = (value: any, cls: any) => {
  if (isFn(cls)) return value instanceof cls;
  if (isStr(cls)) return globalThisPolyfill[cls] ? value instanceof globalThisPolyfill[cls] : false;
  return false;
};

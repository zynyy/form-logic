import { StrNumBool } from '@/interface';

export const strNumBoolToBoolean = (val?: StrNumBool) => {
  return val === undefined ? false : Boolean(Number(val));
};

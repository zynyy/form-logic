import { StrNumBool } from '@/interface';

export const strNumBoolToBoolean = (val?: StrNumBool) => {
  return val === undefined ? false : Boolean(Number(val));
};

export const xCompileOmitted = [
  'default',
  'x-validator',
  'x-decorator-props',
  'x-component-props',
  'x-data',
  'description',
  'title',
  'message',
];

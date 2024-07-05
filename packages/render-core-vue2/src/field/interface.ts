import { FieldDataSource, FieldValidator } from '@formily/core';
import { ExtractPropTypes, PropType } from 'vue';

import { anyType, arrayType, baseFieldProps, booleanType } from '@/utils';

export const getFieldProps = <ValueType = any>() => ({
  ...baseFieldProps(),
  value: anyType<ValueType>(),
  initialValue: anyType<ValueType>(),
  required: booleanType(),
  validateFirst: booleanType(),
  validator: {
    type: [Object, Array] as PropType<FieldValidator>,
  },
  dataSource: arrayType<FieldDataSource>(),
  content: anyType(),
  data: anyType(),
});

export const getArrayFieldProps = () => {
  return {
    ...getFieldProps(),
  };
};
export const getObjectFieldProps = () => {
  return {
    ...getFieldProps(),
  };
};

export const getVoidFieldProps = () => ({
  ...baseFieldProps(),
});

export type FieldProps = ExtractPropTypes<ReturnType<typeof getFieldProps>>;
export type ObjectFieldProps = ExtractPropTypes<ReturnType<typeof getArrayFieldProps>>;
export type ArrayFieldProps = ExtractPropTypes<ReturnType<typeof getObjectFieldProps>>;
export type VoidFieldProps = ExtractPropTypes<ReturnType<typeof getVoidFieldProps>>;

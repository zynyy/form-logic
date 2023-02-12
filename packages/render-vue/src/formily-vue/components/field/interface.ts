import { ExtractPropTypes, PropType } from 'vue';
import { baseFieldProps } from '@/formily-vue/utils/getFieldProps';
import { FieldDataSource, FieldValidator } from '@formily/core';

export const getFieldProps = <ValueType = any>() => ({
  ...baseFieldProps(),
  value: {
    type: null as PropType<ValueType>,
  },
  initialValue: {
    type: null as PropType<ValueType>,
  },
  required: {
    type: Boolean,
    default: undefined,
  },
  validateFirst: {
    type: Boolean,
    default: undefined,
  },
  validator: {
    type: [String, Object] as PropType<FieldValidator>,
  },
  dataSource: {
    type: Array as PropType<FieldDataSource>,
  },
  content: {
    type: null,
  },
  data: {
    type: null,
  },
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

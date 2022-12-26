import { createContext, useContext } from 'react';
import { ArrayBaseProps } from '@/components/array-base';
import { ArrayField } from '@formily/core';
import { Schema } from '@formily/react';

export interface ArrayBaseValueContext {
  props: ArrayBaseProps;
  field: ArrayField;
  schema: Schema;
}

export interface ArrayItemValueContext {
  index: number;
  record: any;
}

export const ArrayBaseContext = createContext<ArrayBaseValueContext>(null);

export const ArrayItemContext = createContext<ArrayItemValueContext>(null);

export const useArrayContext = () => {
  return useContext(ArrayBaseContext);
};

export const useArrayItemContext = () => {
  return useContext(ArrayItemContext);
};

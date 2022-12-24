import { createContext, useContext } from 'react';
import { ArrayBaseItemProps, ArrayBaseProps } from '@/components/array-base';
import { ArrayField } from '@formily/core';
import { Schema } from '@formily/react';

export interface ArrayBaseValueContext {
  props: ArrayBaseProps;
  field: ArrayField;
  schema: Schema;
}

export const ArrayBaseContext = createContext<ArrayBaseValueContext>(null);

export const ArrayItemContext = createContext<ArrayBaseItemProps>(null);

export const useArrayContext = () => {
  return useContext(ArrayBaseContext);
};

export const useArrayItemContext = () => {
  return useContext(ArrayItemContext);
};


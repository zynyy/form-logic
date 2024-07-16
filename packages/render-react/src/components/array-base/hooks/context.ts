import { createContext, useContext } from 'react';
import { ArrayBaseProps } from '@/components/array-base';

import { useForm } from '@formily/react';
import { ArrayField, isArrayField } from '@formily/core';

export interface ArrayBaseValueContext {
  fieldAddress: string;
  props: ArrayBaseProps;
}

export interface ArrayItemValueContext {
  index: number;
  record: any;
}

export const ArrayBaseContext = createContext<ArrayBaseValueContext>(null);

export const ArrayItemContext = createContext<ArrayItemValueContext>(null);

export interface ArrayContext extends ArrayBaseValueContext {
  field: ArrayField;
}

export const useArrayContext = (): ArrayContext => {
  const arrayBaseContext = useContext(ArrayBaseContext);
  const form = useForm();

  const { fieldAddress } = arrayBaseContext || {};

  const target = form.query(fieldAddress).take();

  return {
    ...arrayBaseContext,
    field: isArrayField(target) ? target : null,
  };
};

export const useArrayItemContext = () => {
  return useContext(ArrayItemContext);
};

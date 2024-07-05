import {
  FieldDisplayTypes,
  FieldPatternTypes,
  FieldReaction,
  FormPathPattern,
} from '@formily/core';
import { Component, PropType } from 'vue';

import { VueFieldComponent, VueFieldDecorator } from '@/interface';

import { anyType, arrayType, booleanType, stringType } from './vuePropsType';

export const getFieldComponent = <D extends Component, C extends Component>() => {
  return {
    decorator: arrayType<VueFieldDecorator<D>>(),
    component: arrayType<VueFieldComponent<C>>(),
  };
};

export const baseFieldProps = <D extends Component, C extends Component>() => ({
  name: anyType<FormPathPattern>('', true),
  basePath: anyType<FormPathPattern>(),
  title: stringType(),
  description: stringType(),
  display: stringType<FieldDisplayTypes>(),
  pattern: stringType<FieldPatternTypes>(),
  hidden: booleanType(),
  visible: booleanType(),
  editable: booleanType(),
  disabled: booleanType(),
  readOnly: booleanType(),
  readPretty: booleanType(),
  ...getFieldComponent<D, C>(),
  reactions: {
    type: [Array, Function] as PropType<FieldReaction[] | FieldReaction>,
  },
});

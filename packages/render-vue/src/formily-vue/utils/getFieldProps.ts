import { PropType } from 'vue';

import { FieldDisplayTypes, FieldPatternTypes, FormPathPattern } from '@formily/core';

import { FieldComponent, FieldDecorator, FieldReaction, VueComponent } from '@/formily-vue';

export const getFieldComponent = <D extends VueComponent, C extends VueComponent>() => {
  return {
    decorator: {
      type: null as PropType<FieldDecorator<D>>,
    },
    component: {
      type: null as PropType<FieldComponent<C>>,
    },
  };
};

export const baseFieldProps = <
  Decorator extends VueComponent,
  Component extends VueComponent,
  TextType = any,
  ValueType = any,
>() => ({
  name: {
    type: null as PropType<FormPathPattern>,
    required: true,
  },
  basePath: {
    type: null as PropType<FormPathPattern>,
  },
  title: {
    type: null as PropType<TextType>,
  },
  description: {
    type: null as PropType<TextType>,
  },
  display: {
    type: String as PropType<FieldDisplayTypes>,
  },
  pattern: {
    type: String as PropType<FieldPatternTypes>,
  },
  hidden: {
    type: Boolean,
    default: undefined,
  },
  visible: {
    type: Boolean,
    default: undefined,
  },
  editable: {
    type: Boolean,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: undefined,
  },
  readOnly: {
    type: Boolean,
    default: undefined,
  },
  readPretty: {
    type: Boolean,
    default: undefined,
  },
  ...getFieldComponent<Decorator, Component>(),
  reactions: {
    type: [Array, Function] as PropType<FieldReaction[] | FieldReaction>,
  },
});

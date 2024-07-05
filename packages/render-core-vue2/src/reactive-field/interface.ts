import { GeneralField } from '@formily/core';
import { ExtractPropTypes, PropType } from 'vue';

export const getReactiveFieldProps = () => {
  return {
    field: {
      type: Object as PropType<GeneralField>,
      required: true,
    },
  };
};

export type ReactiveFieldProps = ExtractPropTypes<ReturnType<typeof getReactiveFieldProps>>;

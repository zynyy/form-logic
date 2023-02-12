import { ExtractPropTypes } from 'vue';

export const getFormGroupProps = () => {
  return {
    code: {
      type: String,
    },
    title: {
      type: String,
    },
    class: {
      type: String,
    },
    hiddenName: {
      type: Boolean,
      default: undefined,
    },
  };
};

export type FormGroupProps = ExtractPropTypes<ReturnType<typeof getFormGroupProps>>;

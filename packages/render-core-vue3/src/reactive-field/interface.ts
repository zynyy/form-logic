import { ExtractPropTypes } from 'vue';

export const getReactiveFieldProps = () => {
  return {};
};

export type ReactiveFieldProps = ExtractPropTypes<ReturnType<typeof getReactiveFieldProps>>;

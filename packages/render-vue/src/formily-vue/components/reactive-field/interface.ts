import {ExtractPropTypes, PropType} from "vue";
import {GeneralField} from "@formily/core";

export const getReactiveFieldProps = () => {
  return {
    field: {
      type: Object as PropType<GeneralField>,
      required: true,
    },
  };
};

export type ReactiveFieldProps = ExtractPropTypes<ReturnType<typeof getReactiveFieldProps>>;

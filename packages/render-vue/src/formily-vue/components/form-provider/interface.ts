import {ExtractPropTypes, PropType} from "vue";
import {Form} from "@formily/core";


export const getFormProviderProps = () => {
  return {
    form: {
      type: Object as PropType<Form>,
    },
  };
};


export type FormProviderProps = ExtractPropTypes<ReturnType<typeof getFormProviderProps>>;

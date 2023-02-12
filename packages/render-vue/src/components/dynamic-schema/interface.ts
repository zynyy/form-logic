import { ExtractPropTypes, PropType, Ref } from 'vue';

export const getDynamicSchemaProps = () => {
  return {
    pageCode: {
      type: String,
    },
  };
};

export type DynamicSchemaProps = ExtractPropTypes<ReturnType<typeof getDynamicSchemaProps>>;

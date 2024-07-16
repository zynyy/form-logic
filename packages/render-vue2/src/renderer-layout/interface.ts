import { Form, functionType, objectType } from '@formlogic/render-core-vue2';
import { ExtractPropTypes } from 'vue';

import { Components, LogicConfigFn } from '@/interface';

export const getBasicSchemaProps = () => {
  return {
    extraLogicParams: objectType<Record<string, any>>(),
    getLogicConfig: functionType<LogicConfigFn>(),
    components: objectType<Components>(),
    form: objectType<Form>(),
  };
};

export type BasicFormRenderProps = ExtractPropTypes<ReturnType<typeof getBasicSchemaProps>>;

import { SchemaPattern, arrayType, booleanType, stringType } from '@formlogic/render-core-vue2';
import type { ExtractPropTypes } from 'vue';

import { MetaSchemaData } from '@/interface';
import { getBasicSchemaProps } from '@/renderer-layout/interface';

export const getSchemeButtonsFormProps = () => {
  return {
    ...getBasicSchemaProps(),
    buttons: arrayType<MetaSchemaData[]>([]),
    pageCode: stringType(),
    disabled: booleanType(),
    loading: booleanType(),
    pattern: stringType<SchemaPattern>('EDITABLE'), // 表单模式
  };
};

export type SchemeButtonsFormProps = ExtractPropTypes<ReturnType<typeof getSchemeButtonsFormProps>>;

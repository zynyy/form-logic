import { ISchema, SchemaPattern, makeRequiredProp } from '@formlogic/render-core-vue3';
import type { ExtractPropTypes, PropType } from 'vue';

import { getBasicSchemaProps } from '@/renderer-layout/interface';

export const getSchemeFormProps = () => {
  return {
    ...getBasicSchemaProps(),
    schema: makeRequiredProp<PropType<ISchema>>(Object),
    pattern: {
      type: String as PropType<SchemaPattern>,
      default: 'EDITABLE',
    },
    language: {
      type: String as PropType<string>,
      default: 'zh-CN',
    },
    loading: {
      type: Boolean,
      default: false as const,
    },
  };
};

export type SchemeFormProps = ExtractPropTypes<ReturnType<typeof getSchemeFormProps>>;

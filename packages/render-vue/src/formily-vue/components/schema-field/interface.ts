import { ExtractPropTypes, PropType } from 'vue';
import { ISchema, SchemaKey } from '@formily/json-schema';

import { FormPathPattern } from '@formily/core';
import { SchemaFilter, SchemaMapper, SchemaVueComponents } from '@/formily-vue/interface';

export const getSchemaFieldProps = () => {
  return {
    schema: {
      type: Object as PropType<ISchema>,
      required: true,
    },
    scope: {
      type: null,
    },
    components: {
      type: Object as PropType<SchemaVueComponents>,
    },
    name: {
      type: [String, Number] as PropType<SchemaKey>,
    },
    basePath: {
      type: null as PropType<FormPathPattern>,
    },
    onlyRenderProperties: {
      type: Boolean,
      default: undefined,
    },
    onlyRenderSelf: {
      type: Boolean,
      default: undefined,
    },
    mapProperties: {
      type: Function as PropType<SchemaMapper>,
    },
    filterProperties: {
      type: Function as PropType<SchemaFilter>,
    },
  };
};

export interface SchemaFieldOptions<Components extends SchemaVueComponents> {
  components?: Components;
  scope?: any;
}

export type SchemaFieldProps = ExtractPropTypes<ReturnType<typeof getSchemaFieldProps>>;

export const getRecursionFieldProps = () => {
  return {
    schema: {
      type: Object as PropType<ISchema>,
      required: true,
    },
    name: {
      type: [String, Number] as PropType<SchemaKey>,
    },
    basePath: {
      type: null as PropType<FormPathPattern>,
    },
    onlyRenderProperties: {
      type: Boolean,
      default: undefined,
    },
    onlyRenderSelf: {
      type: Boolean,
      default: undefined,
    },
    mapProperties: {
      type: Function as PropType<SchemaMapper>,
    },
    filterProperties: {
      type: Function as PropType<SchemaFilter>,
    },
  };
};

export type RecursionFieldProps = ExtractPropTypes<ReturnType<typeof getRecursionFieldProps>>;

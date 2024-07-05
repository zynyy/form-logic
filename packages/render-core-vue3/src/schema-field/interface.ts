import { FormPathPattern } from '@formily/core';
import { ISchema, SchemaKey } from '@formily/json-schema';
import { ExtractPropTypes, PropType } from 'vue';

import { SchemaFilter, SchemaMapper, SchemaVueComponents } from '@/interface';
import { anyType, objectType } from '@/utils';

export const getSchemaFieldProps = () => {
  return {
    schema: objectType<ISchema>(),
    scope: {
      type: null,
    },
    components: {
      type: Object as PropType<SchemaVueComponents>,
    },
    name: {
      type: [String, Number] as PropType<SchemaKey>,
    },
    basePath: anyType<FormPathPattern>(),
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
    schema: objectType<ISchema>(),
    name: {
      type: [String, Number] as PropType<SchemaKey>,
    },
    basePath: anyType<FormPathPattern>(),
    onlyRenderProperties: {
      type: Boolean,
      default: false,
    },
    onlyRenderSelf: {
      type: Boolean,
      default: false,
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

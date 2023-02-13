import { computed, h, } from 'vue';
import { Schema } from '@formily/json-schema';
import RecursionField from './RecursionField';

import { lazyMerge } from '@formily/shared';

import { provideSchemaComponents, provideSchemaScope } from './hooks';
import { getSchemaFieldProps, SchemaFieldOptions, SchemaFieldProps } from './interface';
import { DefineComponent, SchemaVueComponents } from '@/formily-vue/interface';

type SchemaFieldComponents = {
  SchemaField: DefineComponent<SchemaFieldProps>;
};

export const createSchemaField = <Components extends SchemaVueComponents = SchemaVueComponents>(
  options: SchemaFieldOptions<Components>,
): SchemaFieldComponents => {
  const SchemaField = {
    name: 'SchemaField',
    inheritAttrs: false,
    props: getSchemaFieldProps(),

    setup(props: SchemaFieldProps) {
      const schemaRef = computed(() => {
        return Schema.isSchemaInstance(props.schema)
          ? props.schema
          : new Schema({
              type: 'object',
              ...props.schema,
            });
      });

      const scopeRef = computed(() => lazyMerge(options.scope, props.scope));

      const componentsRef = computed(() => lazyMerge(options.components, props.components));

      provideSchemaComponents(componentsRef);

      provideSchemaScope(scopeRef);

      return () => {
        return h(
          RecursionField,
          {
            ...props,
            schema: schemaRef.value,
          },
          {},
        );
      };
    },
  };

  return {
    SchemaField,
  } as unknown as SchemaFieldComponents;
};

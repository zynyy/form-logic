import { h, watch, computed, markRaw, defineComponent, shallowRef } from 'vue';
import { GeneralField } from '@formily/core';
import { isFn, isValid } from '@formily/shared';
import { Schema } from '@formily/json-schema';

import Fragment from '../fragment';

import { Field, ArrayField, ObjectField, VoidField, useField } from '../field';

import { observer } from '@/formily-vue/shared';
import { formatComponentProps } from '@/utils';
import { getRecursionFieldProps, RecursionFieldProps } from './interface';

import { provideFieldSchema, useSchemaScopeContext } from './hooks';

const resolveEmptySlot = (slots: Record<any, (...args: any[]) => any[]>) => {
  return Object.keys(slots).length ? h(Fragment, {}, slots) : undefined;
};

const RecursionField = observer<RecursionFieldProps>(
  defineComponent({
    name: 'RecursionField',
    inheritAttrs: false,
    props: getRecursionFieldProps(),
    setup(props: RecursionFieldProps, { slots }) {
      const parentRef = useField();

      const scopeRef = useSchemaScopeContext();
      const createSchema = (schemaProp: RecursionFieldProps['schema']) => {
        return markRaw(new Schema(schemaProp));
      };

      const fieldSchemaRef = computed(() => createSchema(props.schema));

      const getFieldPropsSchema = (schema: Schema) => {
        return schema?.toFieldProps?.({
          scope: scopeRef.value,
        });
      };

      const fieldPropsRef = shallowRef(getFieldPropsSchema(fieldSchemaRef.value));

      watch([fieldSchemaRef, scopeRef], () => {
        fieldPropsRef.value = getFieldPropsSchema(fieldSchemaRef.value);
      });

      const getBasePath = () => {
        if (props.onlyRenderProperties) {
          return props.basePath ?? parentRef?.value?.address.concat(props.name);
        }
        return props.basePath ?? parentRef?.value?.address;
      };

      provideFieldSchema(fieldSchemaRef);

      return () => {
        const basePath = getBasePath();

        const fieldProps = fieldPropsRef.value;

        const generateSlotsByProperties = (scoped = false) => {
          if (props.onlyRenderSelf) {
            return {};
          }

          const properties = Schema.getOrderProperties(fieldSchemaRef.value);
          if (!properties.length) {
            return {};
          }
          const renderMap: Record<string, ((field?: GeneralField) => unknown)[]> = {};
          const setRender = (key: string, value: (field?: GeneralField) => unknown) => {
            if (!renderMap[key]) {
              renderMap[key] = [];
            }
            renderMap[key].push(value);
          };

          properties.forEach(({ schema: item, key: name }, index) => {
            let schema: Schema = item;

            if (isFn(props.mapProperties)) {
              const mapped = props.mapProperties(item, name);
              if (mapped) {
                schema = mapped;
              }
            }

            if (isFn(props.filterProperties)) {
              if (props.filterProperties(schema, name) === false) {
                schema = null;
              }
            }

            if (schema) {
              setRender('default', (field?: GeneralField) => {
                return (
                  <RecursionField
                    {...formatComponentProps({
                      key: `${index}-${name}`,
                      attrs: {
                        schema,
                        name,
                        basePath: field?.address ?? basePath,
                      },
                    })}
                  />
                );
              });
            }
          });
          const slots = {};
          Object.keys(renderMap).forEach((key) => {
            const renderFns = renderMap[key];
            slots[key] = scoped
              ? ({ field }) => renderFns.map((fn) => fn(field))
              : () => renderFns.map((fn) => fn());
          });
          return slots;
        };

        const render = () => {
          if (!isValid(props.name)) {
            return resolveEmptySlot(generateSlotsByProperties());
          }

          switch (fieldSchemaRef.value.type) {
            case 'void': {
              if (props.onlyRenderProperties) {
                return resolveEmptySlot(generateSlotsByProperties());
              }
              const slots = generateSlotsByProperties(true);

              return (
                <VoidField
                  {...formatComponentProps({
                    attrs: {
                      ...fieldProps,
                      name: props.name,
                      basePath: basePath,
                    },
                  })}
                  v-slots={slots}
                />
              );
            }

            case 'object': {
              if (props.onlyRenderProperties) {
                return resolveEmptySlot(generateSlotsByProperties());
              }

              return (
                <ObjectField
                  {...formatComponentProps({
                    attrs: {
                      ...fieldProps,
                      name: props.name,
                      basePath: basePath,
                    },
                  })}
                  v-slots={generateSlotsByProperties(true)}
                />
              );
            }
            case 'array': {
              return (
                <ArrayField
                  {...formatComponentProps({
                    attrs: {
                      ...fieldProps,
                      name: props.name,
                      basePath: basePath,
                    },
                  })}
                />
              );
            }
            default: {
              return (
                <Field
                  {...formatComponentProps({
                    attrs: {
                      ...fieldProps,
                      name: props.name,
                      basePath: basePath,
                    },
                  })}
                />
              );
            }
          }
        };

        if (!fieldSchemaRef.value) {
          return slots?.default?.();
        }

        return render();
      };
    },
  }),
);

export default RecursionField;

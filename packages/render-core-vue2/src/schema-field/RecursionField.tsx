import { GeneralField } from '@formily/core';
import { ISchema } from '@formily/json-schema';
import { isFn, isValid } from '@formily/shared';
import { computed, defineComponent, markRaw, shallowRef, watch } from 'vue';

import { ArrayField, Field, ObjectField, useField, VoidField } from '@/field';
import Fragment from '@/fragment';
import Schema from '@/json-schema';
import { compatibleCreateElement, formatComponentProps, observer } from '@/utils';

import { provideFieldSchema, useSchemaScopeContext } from './hooks';
import { getRecursionFieldProps, RecursionFieldProps } from './interface';

const resolveEmptySlot = (slots: Record<any, (...args: any[]) => any[]>) => {
  return Object.keys(slots).length ? compatibleCreateElement(Fragment, {}, slots) : undefined;
};

const RecursionField = observer(
  defineComponent({
    name: 'RecursionField',
    inheritAttrs: false,
    props: getRecursionFieldProps(),
    setup(props: RecursionFieldProps, { slots }) {
      const parentRef = useField();

      const scopeRef = useSchemaScopeContext();
      const createSchema = (schemaProps: ISchema) => {
        return markRaw(new Schema(schemaProps));
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
          return props.basePath ?? parentRef?.value?.address.concat(props.name ?? '');
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
            let schema: Schema | null = item;

            if (isFn(props.mapProperties)) {
              const mapped = props.mapProperties(item, name);
              if (mapped) {
                schema = mapped;
              }
            }

            if (isFn(props.filterProperties) && schema) {
              if (!props.filterProperties(schema, name)) {
                schema = null;
              }
            }

            if (schema) {
              setRender('default', (field?: GeneralField) => {
                return compatibleCreateElement(
                  RecursionField,
                  {
                    attrs: formatComponentProps({
                      key: `${index}-${name}`,
                      attrs: {
                        schema,
                        name,
                        basePath: field?.address ?? basePath,
                      },
                    }),
                  },
                  {},
                );
              });
            }
          });
          const slots: Record<string, any> = {};
          Object.keys(renderMap).forEach((key) => {
            const renderFns = renderMap[key];
            if (scoped) {
              slots[key] = ({ field }: any) => {
                return renderFns.map((fn) => fn(field));
              };
            } else {
              slots[key] = () => renderFns.map((fn) => fn());
            }
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

              return compatibleCreateElement(
                VoidField,
                {
                  attrs: formatComponentProps({
                    ...fieldProps,
                    name: props.name,
                    basePath: basePath,
                  }),
                },
                slots,
              );
            }

            case 'object': {
              if (props.onlyRenderProperties) {
                return resolveEmptySlot(generateSlotsByProperties());
              }
              return compatibleCreateElement(
                ObjectField,
                {
                  attrs: formatComponentProps({
                    ...fieldProps,
                    name: props.name,
                    basePath: basePath,
                  }),
                },
                generateSlotsByProperties(true),
              );
            }
            case 'array': {
              return compatibleCreateElement(
                ArrayField,
                {
                  attrs: formatComponentProps({
                    ...fieldProps,
                    name: props.name,
                    basePath: basePath,
                  }),
                },
                {},
              );
            }
            default: {
              return compatibleCreateElement(
                Field,
                {
                  attrs: formatComponentProps({
                    ...fieldProps,
                    name: props.name,
                    basePath: basePath,
                  }),
                },
                {},
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

import {
  FieldDisplayTypes,
  GeneralField,
  Schema,
  useField,
  useFieldSchema,
} from '@formlogic/render-core-vue3';

export interface ObservableColumnSource {
  field?: GeneralField;
  columnProps: any;
  schema: Schema;
  display: FieldDisplayTypes;
  name: string;
}

const useArrayTableSources = (index?: number, basePath?: string) => {
  const arrayField = useField();
  const schema = useFieldSchema();

  const parseSources = (schema: Schema): ObservableColumnSource[] => {
    if (!schema) {
      return [];
    }

    if (arrayField.value.componentType === schema['x-component'] || !schema['x-component']) {
      if (schema.properties) {
        return schema.reduceProperties((buf, cur) => {
          return buf.concat(parseSources(cur));
        }, [] as ObservableColumnSource[]);
      }
      return [];
    } else {
      if (!schema['name']) {
        return [];
      }

      const name = schema['name'].toString();

      let address = arrayField.value.address.concat(name);

      if (basePath) {
        address = arrayField.value.address.concat(basePath).concat(name);
      }

      const field = arrayField.value.query(address).take();
      let columnProps = {};

      if (field && Array.isArray(field?.component)) {
        const [_, componentProps] = field.component;

        columnProps = componentProps;
      }

      if (!columnProps) {
        columnProps = schema['x-component-props'] || {};
      }

      const display = field?.display || schema['x-display'];

      const record: ObservableColumnSource = {
        name,
        display,
        field,
        schema,
        columnProps,
      };

      return [record];
    }
    return [];
  };

  const parseArrayItems = (schemaItem: Schema) => {
    const sources: ObservableColumnSource[] = [];

    return [schemaItem].reduce((columns: ObservableColumnSource[], currentValue: Schema) => {
      const item = parseSources(currentValue);

      if (item) {
        return columns.concat(item);
      }
      return columns;
    }, sources);
  };

  if (!schema.value) {
    throw new Error('can not found schema object');
  }

  const parseSchema = Array.isArray(schema.value.items)
    ? schema.value.items[index ?? 0]
    : schema.value.items;

  if (parseSchema) {
    return parseArrayItems(parseSchema);
  }

  return [];
};

export default useArrayTableSources;

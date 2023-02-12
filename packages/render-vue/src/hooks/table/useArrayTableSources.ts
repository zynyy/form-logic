

import { isArr } from '@formily/shared';
import { FieldDisplayTypes, GeneralField } from '@formily/core';
import {ColumnProps} from "ant-design-vue/es/table";
import {Schema} from "@formily/json-schema";
import {useFieldSchema} from "@/formily-vue/components/schema-field/hooks";
import {useField} from "@/formily-vue";


export interface ObservableColumnSource {
  field: GeneralField;
  columnProps: ColumnProps<any>;
  schema: Schema;
  display: FieldDisplayTypes;
  name: string;
}

const useArrayTableSources = () => {
  const arrayField = useField();
  const schema = useFieldSchema();

  const parseSources = (schema: Schema): ObservableColumnSource[] => {
    if (!schema) {
      return [];
    }

    if (arrayField.value.componentType === schema['x-component'] || !schema['x-component']) {
      if (schema.properties) {
        return schema.reduceProperties((buf, schema) => {
          return buf.concat(parseSources(schema));
        }, []);
      }
    } else {
      if (!schema['name']) {
        return [];
      }

      const name = schema['name'].toString();
      const field = arrayField.value.query(arrayField.value.address.concat(name)).take();
      const columnProps = field?.component?.[1] || schema['x-component-props'] || {};
      const display = field?.display || schema['x-display'];
      return [
        {
          name,
          display,
          field,
          schema,
          columnProps,
        },
      ];
    }
  };

  const parseArrayItems = (schema: Schema['items']) => {

    const sources: ObservableColumnSource[] = [];
    const items = isArr(schema) ? schema : [schema];

    return items.reduce((columns, schema) => {
      const item = parseSources(schema);

      if (item) {
        return columns.concat(item);
      }
      return columns;
    }, sources);
  };

  if (!schema.value) throw new Error('can not found schema object');

  return parseArrayItems(schema.value.items);
};

export default useArrayTableSources;

import { useField, useFieldSchema } from '@formily/react';
import { Schema } from '@formily/json-schema';
import { isArr } from '@formily/shared';
import { FieldDisplayTypes, GeneralField } from '@formily/core';
import { ColumnProps } from 'antd/es/table';

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
    if (schema['x-component']) {
      if (!schema['name']) {
        return [];
      }
      const name = schema['name'].toString();
      const field = arrayField.query(arrayField.address.concat(name)).take();
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
    } else if (schema.properties) {
      return schema.reduceProperties((buf, schema) => {
        return buf.concat(parseSources(schema));
      }, []);
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

  if (!schema) throw new Error('can not found schema object');

  return parseArrayItems(schema.items);
};

export default useArrayTableSources

import { TableProps } from 'antd';
import ArrayBase from '@/components/array-base';
import { RecursionField } from '@formily/react';
import { ObservableColumnSource } from '@/hooks/useArrayTableSources';

const useArrayTableColumns = (
  dataSource: any[],
  sources: ObservableColumnSource[],
): TableProps<any>['columns'] => {
  const parseChildren = (parentName) => {
    return sources.reduce((buf, { name, columnProps, schema, display }, index) => {
      if (display !== 'visible') {
        return buf;
      }

      if (parentName !== schema['x-data']?.parentCode) {
        return buf;
      }

      const children = parseChildren(name);

      if (children.length) {
        return buf.concat({
          ...columnProps,
          key: `${name}_${index}`,
          dataIndex: name,
          title: schema['title'],
          children,
        });
      }

      return buf.concat({
        ...columnProps,
        key: `${name}_${index}`,
        dataIndex: name,
        title: schema['title'],
        width: columnProps['width'] ?? 120,
        render: (value: any, record: any) => {
          const index = dataSource.indexOf(record);
          return (
            <ArrayBase.Item index={index} record={record} key={name}>
              <RecursionField schema={schema} name={index} onlyRenderProperties />
            </ArrayBase.Item>
          );
        },
      });
    }, []);
  };

  const leftColumns = [];
  const columns = [];
  const rightColumns = [];

  sources
    .reduce((buf, { name, columnProps, schema, display }, index) => {
      if (display !== 'visible' || schema['x-data']?.parentCode) {
        return buf;
      }

      const children = parseChildren(name);

      if (children.length) {
        return buf.concat({
          ...columnProps,
          key: `${name}_${index}`,
          dataIndex: name,
          title: schema['title'],
          children,
        });
      }

      return buf.concat({
        ...columnProps,
        key: `${name}_${index}`,
        dataIndex: name,
        title: schema['title'],
        width: columnProps['width'] ?? 120,
        render: (value: any, record: any) => {
          const index = dataSource.indexOf(record);
          return (
            <ArrayBase.Item index={index} record={record}>
              <RecursionField schema={schema} name={index} onlyRenderProperties />
            </ArrayBase.Item>
          );
        },
      });
    }, [])
    .forEach((item) => {
      const { fixed } = item || {};

      if (!fixed) {
        columns.push(item);
      } else if (fixed === true || fixed === 'left') {
        leftColumns.push(item);
      } else {
        rightColumns.push(item);
      }
    });

  return leftColumns.concat(columns).concat(rightColumns);
};

export default useArrayTableColumns;

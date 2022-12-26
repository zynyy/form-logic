import { TableProps } from 'antd';
import ArrayBase from '@/components/array-base';
import { RecursionField } from '@formily/react';
import { ObservableColumnSource } from '@/components/hooks/useArrayTableSources';

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
        render: (value: any, record: any) => {
          const index = dataSource.indexOf(record);
          return (
            <ArrayBase.Item index={index} record={record}>
              <RecursionField schema={schema} name={index} onlyRenderProperties />
            </ArrayBase.Item>
          );
        },
      });
    }, []);
  };

  return sources.reduce((buf, { name, columnProps, schema, display }, index) => {
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
      render: (value: any, record: any) => {
        const index = dataSource.indexOf(record);
        return (
          <ArrayBase.Item index={index} record={record}>
            <RecursionField schema={schema} name={index} onlyRenderProperties />
          </ArrayBase.Item>
        );
      },
    });
  }, []);
};

export default useArrayTableColumns;

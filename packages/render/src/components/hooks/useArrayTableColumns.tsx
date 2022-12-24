import { TableProps } from 'antd';
import ArrayBase from '@/components/array-base';
import { RecursionField } from '@formily/react';
import { ObservableColumnSource } from '@/components/hooks/useArrayTableSources';

const useArrayTableColumns = (
  dataSource: any[],
  sources: ObservableColumnSource[],
): TableProps<any>['columns'] => {
  return sources.reduce((buf, { name, columnProps, schema, display }, key) => {
    if (display !== 'visible') {
      return buf;
    }
    return buf.concat({
      ...columnProps,
      key,
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

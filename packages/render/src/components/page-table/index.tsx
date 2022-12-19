import { FC } from 'react';
import { Space, Table, TableProps } from 'antd';

import { observer, useField } from '@formily/react';

import { useArrayTableColumns, useArrayTableSources, usePrefixCls, useSchemaBtn } from '../hooks';
import { ArrayBase } from '../array-base';
import { ArrayField } from '@formily/core';
import SchemaFragment from '@/components/schema-fragment';

interface ListTableProps extends TableProps<any> {
  scrollY?: number;
  onAdd?: () => void;
  onEdit?: (record: any, index: number) => void;
  onRemove?: (record: any, index: number) => void;
}

const PageTable: FC<ListTableProps> = observer(
  ({ scrollY, onAdd, onEdit, onRemove, ...restProps }) => {
    const field = useField<ArrayField>();
    const prefixCls = usePrefixCls('formily-list-table');
    const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
    const sources = useArrayTableSources();
    const columns = useArrayTableColumns(dataSource, sources);

    const btn = useSchemaBtn();

    const defaultRowKey = (record: any) => {
      return dataSource.indexOf(record);
    };

    return (
      <div className={prefixCls}>
        <ArrayBase onAdd={onAdd} onEdit={onEdit} onRemove={onRemove}>
          <Table
            size="small"
            rowKey={defaultRowKey}
            {...restProps}
            title={
              btn
                ? () => {
                    return <Space>{btn}</Space>;
                  }
                : null
            }
            bordered
            columns={columns}
            dataSource={dataSource}
            scroll={{
              x: 'max-content',
              y: scrollY,
            }}
            pagination={{
              hideOnSinglePage: true,
            }}
          />
          <SchemaFragment schemaSource={sources} />
        </ArrayBase>
      </div>
    );
  },
);

export default PageTable;

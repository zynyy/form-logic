import { FC } from 'react';
import { Space, Table, TableProps } from 'antd';

import { observer, useField } from '@formily/react';

import { useArrayTableColumns, useArrayTableSources, useSchemaBtn } from '@/hooks';
import ArrayBase, { ArrayBaseProps } from '../array-base';
import { ArrayField } from '@formily/core';
import SchemaFragment from '@/components/schema-fragment';
import { useListTableStyle } from '@/components/list-table/hooks';
import cls from 'classnames';
import { DEFAULT_TABLE_PAGINATION } from '@/utils/constant';

export interface ListTableProps extends TableProps<any>, ArrayBaseProps {
  scrollY?: number;
  rowKey?: string;
  onTableChange: TableProps<any>['onChange'];
}

const ListTable: FC<ListTableProps> = observer(
  ({
    scrollY,
    onAdd,
    onEdit,
    onDetail,
    onRemove,
    rowKey,
    onTableChange,
    pagination,
    ...restProps
  }) => {
    const field = useField<ArrayField>();
    const [warpSSR, hashId, prefixCls] = useListTableStyle();
    const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
    const sources = useArrayTableSources();
    const columns = useArrayTableColumns(dataSource, sources);

    const btn = useSchemaBtn();

    const defaultRowKey = (record: any) => {
      return record[rowKey] ?? dataSource.indexOf(record);
    };

    return warpSSR(
      <div className={cls(prefixCls, hashId)}>
        <ArrayBase onAdd={onAdd} onEdit={onEdit} onRemove={onRemove} onDetail={onDetail}>
          <Table
            {...restProps}
            size="small"
            onChange={onTableChange}
            rowKey={defaultRowKey}
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
              ...DEFAULT_TABLE_PAGINATION,
              ...pagination,
            }}
          />
          <SchemaFragment schemaSource={sources} />
        </ArrayBase>
      </div>,
    );
  },
);

export default ListTable;

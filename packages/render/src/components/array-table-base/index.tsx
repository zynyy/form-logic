import { FC, Key, useRef, useState } from 'react';
import { Space, Table, TableProps } from 'antd';
import cls from 'classnames';
import { connect, mapProps, observer, useField } from '@formily/react';
import { isBool } from '@formily/shared';

import { useArrayTableColumns, useArrayTableSources, useSchemaBtn } from '@/hooks';
import ArrayBase, { ArrayBaseProps } from '../array-base';
import { ArrayField } from '@formily/core';
import SchemaFragment from '@/components/schema-fragment';
import ArrayPagination from '@/components/array-pagination';

import { useArrayTableBaseStyle, SortableContext } from '@/components/array-table-base/hooks';
import SortableBodyRow from '@/components/array-table-base/SortableBodyRow';
import SortableBodyWrapper from '@/components/array-table-base/SortableBodyWrapper';

import { RowSelectionType } from 'antd/es/table/interface';
import { strNumBoolToBoolean } from '@formlogic/component';

export interface ArrayTableBaseProps extends TableProps<any>, ArrayBaseProps {
  scrollY?: number;
  hasPagination?: boolean;
  hasRowSelection?: boolean;
  rowSelectionType?: RowSelectionType;
}

const InternalArrayTableBase: FC<ArrayTableBaseProps> = observer(
  ({
    pagination: propsPagination,
    onEdit,
    onCopy,
    onMoveUp,
    onAdd,
    onRemove,
    onMoveDown,
    scrollY,
    hasPagination,
    onDetail,
    rowKey,
    onRow,
    hasRowSelection,
    rowSelection,
    rowSelectionType,
    ...tableProps
  }) => {
    const containerRef = useRef<HTMLDivElement>();

    const field = useField<ArrayField>();
    const [warpSSR, hashId, prefixCls] = useArrayTableBaseStyle();
    const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
    const sources = useArrayTableSources();
    const columns = useArrayTableColumns(dataSource, sources);
    const pagination = isBool(propsPagination) ? {} : propsPagination;

    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const handlePaginationChange = () => {
      setSelectedRowKeys([]);
      setSelectedRows([]);
    };

    const btn = useSchemaBtn();

    const defaultRowKey = (record: any) => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }

      return record[rowKey] || dataSource.indexOf(record);
    };

    const setRowProps = (record, index) => {
      const rowProps = onRow?.(record, index);

      return {
        ...rowProps,
        index,
      };
    };

    const handleRowSelectionChange = (rowKeys: Key[], changeSelectedRows: any[], info) => {
      setSelectedRowKeys(rowKeys);
      setSelectedRows(changeSelectedRows);
      rowSelection?.onChange?.(rowKeys, changeSelectedRows, info);
    };

    const getRowSelectionConfig = () => {
      if (hasRowSelection) {
        return {
          ...rowSelection,
          selectedRowKeys,
          selectedRows,
          type: rowSelectionType ?? 'checkbox',
          onChange: handleRowSelectionChange,
        };
      }
      return null;
    };

    const nextRowSelection = getRowSelectionConfig();

    return warpSSR(
      <div ref={containerRef} className={cls(prefixCls, hashId)}>
        <ArrayPagination {...pagination} onChange={handlePaginationChange} dataSource={dataSource}>
          {(data, pager, { startIndex }) => {
            const nextData = hasPagination ? data : dataSource;

            return (
              <SortableContext.Provider
                value={{
                  list: nextData,
                  start: hasPagination ? startIndex : 0,
                  containerRef,
                }}
              >
                <ArrayBase
                  onRemove={onRemove}
                  onAdd={onAdd}
                  onCopy={onCopy}
                  onEdit={onEdit}
                  onDetail={onDetail}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                >
                  <Table
                    rowKey={defaultRowKey}
                    title={
                      btn
                        ? () => {
                            return <Space>{btn}</Space>;
                          }
                        : null
                    }
                    {...tableProps}
                    rowSelection={nextRowSelection}
                    size="small"
                    onChange={() => {}}
                    pagination={false}
                    columns={columns}
                    dataSource={nextData}
                    scroll={{
                      x: 'max-content',
                      y: scrollY ?? 520,
                    }}
                    bordered
                    onRow={setRowProps}
                    components={{
                      body: {
                        wrapper: SortableBodyWrapper,
                        row: SortableBodyRow,
                      },
                    }}
                  />

                  {hasPagination ? (
                    <div style={{ marginTop: 5, marginBottom: 5 }}>{pager}</div>
                  ) : null}

                  <SchemaFragment schemaSource={sources} />
                </ArrayBase>
              </SortableContext.Provider>
            );
          }}
        </ArrayPagination>
      </div>,
    );
  },
);

const ArrayTableBase = connect(
  InternalArrayTableBase,
  mapProps((props) => {
    const { hasPagination, hasRowSelection } = props || {};
    return {
      ...props,
      hasRowSelection: strNumBoolToBoolean(hasRowSelection),
      hasPagination: strNumBoolToBoolean(hasPagination),
    };
  }),
);

export default ArrayTableBase;

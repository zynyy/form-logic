import { defineComponent, VNode } from 'vue';
import type { ArrayField } from '@formily/core';

import { Table, Space } from 'ant-design-vue';


import { RecursionField, useField,observer } from '@/formily-vue';

import { useArrayTableColumns, useArrayTableSources, useTableSchemaBtn } from '@/hooks';

import ArrayBase from '@/components/array-base/ArrayBase';
import SchemaFragment from '@/components/schema-fragment';
import { useItemKey } from '@/components/array-base/hooks';

import { useStylePrefixCls } from '@/components/style/hooks';
import { DEFAULT_TABLE_PAGINATION } from '@/utils/constant';
import { getListTableProps, ListTableProps } from '@/components/list-table/interface';

const ListTable = observer<ListTableProps>(
  defineComponent({
    name: 'ListTable',
    inheritAttrs: false,
    props: getListTableProps(),
    setup(props: ListTableProps) {
      const fieldRef = useField<ArrayField>();

      const prefixCls = useStylePrefixCls('list-table');

      const { getRecordKey } = useItemKey(true);

      const btn = useTableSchemaBtn();

      return () => {
        const {
          onRemove,
          onAdd,
          onCopy,
          onEdit,
          onDetail,
          onMoveUp,
          onMoveDown,
          scrollY,
          rowSelection,
          onTableChange,
          pagination,
          selectedRowKeys,
          setSelectedRowKeys,
          selectedRows,
          setSelectedRows,
          loading,
        } = props;

        const field = fieldRef.value;
        const dataSource = Array.isArray(field.value) ? field.value.slice() : [];

        const defaultRowKey = (record: any) => {
          if (typeof props.rowKey === 'function') {
            return props.rowKey(record);
          }

          return record[props.rowKey] || getRecordKey(record);
        };

        const sources = useArrayTableSources();
        const columns = useArrayTableColumns(dataSource, sources);

        const renderTitle = () => {
          return btn ? <Space>{btn}</Space> : null;
        };

        const renderBodyCell = ({ record, index, column }) => {
          const { schema } = column || {
            schema: {},
          };


          return (
            <ArrayBase.Item index={index} record={record}>
              <RecursionField schema={schema} name={index} onlyRenderProperties />
            </ArrayBase.Item>
          );
        };

        const slots: Record<string, (...args) => VNode> = {
          bodyCell: renderBodyCell,
        };

        if (btn) {
          slots.title = renderTitle;
        }

        return (
          <div class={prefixCls}>
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
                bordered
                loading={loading}
                rowSelection={rowSelection}
                rowKey={defaultRowKey}
                size="small"
                columns={columns}
                dataSource={dataSource}
                scroll={{
                  x: 'max-content',
                  y: scrollY ?? 520,
                }}
                onChange={onTableChange}
                pagination={{
                  ...DEFAULT_TABLE_PAGINATION,
                  // @ts-ignore
                  ...pagination,
                }}
                v-slots={slots}
              />
              <SchemaFragment schemaSource={sources} />
            </ArrayBase>
          </div>
        );
      };
    },
  }),
);

export default ListTable;

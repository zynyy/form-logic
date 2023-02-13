import { defineComponent, ref, VNode } from 'vue';
import type { ArrayField } from '@formily/core';

import { Table, Space } from 'ant-design-vue';

import { observer } from '@/utils/observer';
import { connect, mapProps, RecursionField, useField } from '@/formily-vue';

import ArrayPagination from '@/components/array-pagination/ArrayPagination';
import { useArrayTableColumns, useArrayTableSources, useTableSchemaBtn } from '@/hooks';

import ArrayBase from '@/components/array-base/ArrayBase';
import SchemaFragment from '@/components/schema-fragment';
import { useItemKey } from '@/components/array-base/hooks';
import SortableBodyRow from '@/components/array-table-base/SortableBodyRow';
import SortableBodyWrapper from '@/components/array-table-base/SortableBodyWrapper';
import SortableContext from '@/components/array-table-base/SortableContext';

import {
  ArrayTableBaseProps,
  getArrayTableBaseProps,
} from '@/components/array-table-base/interface';
import { loop } from '@/utils';
import { Key } from 'ant-design-vue/es/_util/type';
import { strNumBoolToBoolean } from '@/transforms/utils';
import { useStylePrefixCls } from '@/components/style/hooks';

const components = {
  body: {
    wrapper: SortableBodyWrapper,
    row: SortableBodyRow,
  },
};

const InternalArrayTableBase = observer<ArrayTableBaseProps>(
  defineComponent({
    name: 'ArrayTableBase',
    inheritAttrs: false,
    props: getArrayTableBaseProps(),
    setup(props: ArrayTableBaseProps) {
      const fieldRef = useField<ArrayField>();

      const prefixCls = useStylePrefixCls('-array-table');

      const selectedRowKeysRef = ref([]);
      const selectedRowsRef = ref([]);

      const setSelectedRowKeys = (nextSelectedRowKeys) => {
        selectedRowKeysRef.value = nextSelectedRowKeys;
      };

      const setSelectedRows = (nextSelectedRows) => {
        selectedRowsRef.value = nextSelectedRows;
      };

      const { getRecordKey } = useItemKey(true);

      const setRowProps = (record, index) => {
        const rowProps = props.customRow?.(record, index);

        return {
          ...rowProps,
          index,
        };
      };

      const handlePaginationChange = () => {};

      const btn = useTableSchemaBtn();

      const handleRowSelectionChange = (rowKeys: Key[], changeSelectedRows: any[], info) => {
        setSelectedRowKeys(rowKeys);
        setSelectedRows(changeSelectedRows);
        // @ts-ignore
        props.rowSelection?.onChange?.(rowKeys, changeSelectedRows, info);
      };

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
          hasPagination,
          hasRowSelection,
          rowSelectionType,
          rowSelection,
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

        const getRowSelectionConfig = () => {
          if (hasRowSelection) {
            return {
              // @ts-ignore
              ...rowSelection,
              selectedRowKeys: selectedRowKeysRef.value,
              selectedRows: selectedRowsRef.value,
              type: rowSelectionType ?? 'checkbox',
              onChange: handleRowSelectionChange,
            };
          }
          return null;
        };

        const nextRowSelection = getRowSelectionConfig();

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

        const renderTable = (data, pager, { startIndex }) => {
          const nextData = hasPagination ? data : dataSource;

          const slots: Record<string, (...args) => VNode> = {
            bodyCell: renderBodyCell,
          };

          if (btn) {
            slots.title = renderTitle;
          }

          return (
            <SortableContext list={nextData} startIndex={startIndex}>
              <Table
                bordered
                rowKey={defaultRowKey}
                size="small"
                pagination={false}
                columns={columns}
                dataSource={nextData}
                scroll={{
                  x: 'max-content',
                  y: scrollY ?? 520,
                }}
                customRow={setRowProps}
                onChange={loop}
                components={components}
                rowSelection={nextRowSelection}
                v-slots={slots}
              />

              {hasPagination ? <div style={{ marginTop: 5, marginBottom: 5 }}>{pager}</div> : null}
            </SortableContext>
          );
        };

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
              selectedRowKeys={selectedRowKeysRef.value}
              setSelectedRowKeys={setSelectedRowKeys}
              selectedRows={selectedRowsRef.value}
              setSelectedRows={setSelectedRows}
            >
              <ArrayPagination
                onChange={handlePaginationChange}
                dataSource={dataSource}
                v-slots={{
                  default: renderTable,
                }}
              />
              <SchemaFragment schemaSource={sources} />
            </ArrayBase>
          </div>
        );
      };
    },
  }),
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

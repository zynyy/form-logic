import { FC, useCallback, useRef } from 'react';
import { Space, Table, TableProps } from 'antd';

import { observer, useField } from '@formily/react';
import { isBool } from '@formily/shared';

import { useArrayTableColumns, useArrayTableSources, useSchemaBtn } from '../hooks';
import ArrayBase, { ArrayBaseProps } from '../array-base';
import { ArrayField } from '@formily/core';
import SchemaFragment from '@/components/schema-fragment';
import ArrayPagination from '@/components/array-pagination';
import { SortableContainer, SortableElement } from '@/components/drag-sort';
import cls from 'classnames';
import { useArrayTableBaseStyle } from '@/components/array-table-base/hooks';


const SortableRow = SortableElement((props: any) => <tr {...props} />);

const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

const RowComp: FC<React.HTMLAttributes<HTMLTableRowElement>> = (props) => {
  const [warpSSR, hashId, prefixCls] = useArrayTableBaseStyle();
  const index = props['data-row-key'] || 0;
  return warpSSR(
    <SortableRow
      lockAxis="y"
      {...props}
      index={index}
      className={cls(props.className, hashId, `${prefixCls}-row-${index + 1}`)}
    />,
  );
};

export interface ArrayTableBaseProps extends TableProps<any>, ArrayBaseProps {}

const ArrayTableBase: FC<ArrayTableBaseProps> = observer(
  ({
    pagination: propsPagination,
    onEdit,
    onCopy,
    onMoveUp,
    onAdd,
    onRemove,
    onMoveDown,
    ...tableProps
  }) => {
    const divRef = useRef<HTMLDivElement>();
    const field = useField<ArrayField>();
    const [warpSSR, hashId, prefixCls] = useArrayTableBaseStyle();
    const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
    const sources = useArrayTableSources();
    const columns = useArrayTableColumns(dataSource, sources);
    const pagination = isBool(propsPagination) ? {} : propsPagination;

    const btn = useSchemaBtn();

    const defaultRowKey = (record: any) => {
      return dataSource.indexOf(record);
    };

    const addTdStyles = (id: number) => {
      const node = divRef.current?.querySelector(`.${prefixCls}-row-${id}`);
      const helper = divRef.current?.querySelector(`.${prefixCls}-sort-helper`);
      if (helper) {
        const tds = node?.querySelectorAll('td');
        if (tds) {
          requestAnimationFrame(() => {
            helper.querySelectorAll('td').forEach((td, index) => {
              if (tds[index]) {
                td.style.width = getComputedStyle(tds[index]).width;
              }
            });
          });
        }
      }
    };

    const genWrapperComp = useCallback(
      (list: any[], start: number) => (props: React.HTMLAttributes<HTMLTableSectionElement>) => {
        return (
          <SortableBody
            {...props}
            accessibility={{
              container: divRef.current || undefined,
            }}
            start={start}
            list={list}
            onSortStart={(event) => {
              addTdStyles(event.active.id as number);
            }}
            onSortEnd={(event) => {
              const { oldIndex, newIndex } = event;
              field.move(oldIndex, newIndex);
            }}
            className={cls(`${prefixCls}-sort-helper`, props.className)}
          >
            {props.children}
          </SortableBody>
        );
      },
      [field],
    );

    return warpSSR(
      <ArrayPagination {...pagination} dataSource={dataSource}>
        {(data, pager, { startIndex }) => (
          <div ref={divRef} className={cls(prefixCls, hashId)}>
            <ArrayBase
              onRemove={onRemove}
              onAdd={onAdd}
              onCopy={onCopy}
              onEdit={onEdit}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
            >
              <Table
                size="small"
                rowKey={defaultRowKey}
                title={
                  btn
                    ? () => {
                        return <Space>{btn}</Space>;
                      }
                    : null
                }
                {...tableProps}
                onChange={() => {}}
                pagination={false}
                columns={columns}
                dataSource={data}
                components={{
                  body: {
                    wrapper: genWrapperComp(data, startIndex),
                    row: RowComp,
                  },
                }}
              />

              <div style={{ marginTop: 5, marginBottom: 5 }}>{pager}</div>

              <SchemaFragment schemaSource={sources} />
            </ArrayBase>
          </div>
        )}
      </ArrayPagination>,
    );
  },

);

export default ArrayTableBase;

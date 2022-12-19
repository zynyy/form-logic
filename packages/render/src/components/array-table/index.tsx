import { FC, ReactElement, ReactNode, useRef, useState } from 'react';
import {
  Badge,
  Pagination,
  Select,
  Space,
  Table,
  PaginationProps,
  SelectProps,
  TableProps,
} from 'antd';

import cls from 'classnames';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { observer, useField, useForm } from '@formily/react';
import { FormPath, isBool } from '@formily/shared';

import { useArrayTableColumns, useArrayTableSources, usePrefixCls, useSchemaBtn } from '../hooks';
import { ArrayBase } from '../array-base';
import { ArrayField } from '@formily/core';
import SchemaFragment from '@/components/schema-fragment';

interface IArrayTablePaginationProps extends PaginationProps {
  dataSource?: any[];
  children?: (dataSource: any[], pagination: ReactNode) => ReactElement;
}

interface IStatusSelectProps extends SelectProps<any> {
  pageSize?: number;
}

type ComposedArrayTable = FC<TableProps<any>>;

const SortableRow = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

const StatusSelect: FC<IStatusSelectProps> = observer((props) => {
  const form = useForm();
  const field = useField<ArrayField>();
  const prefixCls = usePrefixCls('formily-array-table');
  const errors = form.queryFeedbacks({
    type: 'error',
    address: `${field.address}.*`,
  });
  const createIndexPattern = (page: number | string) => {
    const pattern = `${field.address}.*[${(Number(page) - 1) * props.pageSize}:${
      Number(page) * props.pageSize
    }].*`;
    return FormPath.parse(pattern);
  };

  const options = props.options?.map(({ label, value }) => {
    const hasError = errors.some(({ address }) => {
      return createIndexPattern(value).match(address);
    });
    return {
      label: hasError ? <Badge dot>{label}</Badge> : label,
      value,
    };
  });

  const width = String(options?.length).length * 15;

  return (
    <Select
      value={props.value}
      onChange={props.onChange}
      options={options}
      virtual
      style={{
        width: width < 60 ? 60 : width,
      }}
      className={cls(`${prefixCls}-status-select`, {
        'has-error': errors?.length,
      })}
    />
  );
});

const ArrayTablePagination: FC<IArrayTablePaginationProps> = (props) => {
  const [current, setCurrent] = useState(1);
  const prefixCls = usePrefixCls('formily-array-table');
  const pageSize = props.pageSize || 10;
  const size = props.size || 'default';
  const dataSource = props.dataSource || [];
  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;
  const total = dataSource?.length || 0;
  const totalPage = Math.ceil(total / pageSize);

  const pages = Array.from(new Array(totalPage)).map((_, index) => {
    const page = index + 1;
    return {
      label: page,
      value: page,
    };
  });

  const handleChange = (current: number) => {
    setCurrent(current);
  };

  const renderPagination = () => {
    if (totalPage <= 1) return;
    return (
      <div className={`${prefixCls}-pagination`}>
        <Space>
          <StatusSelect
            value={current}
            pageSize={pageSize}
            onChange={handleChange}
            options={pages}
            notFoundContent={false}
          />
          <Pagination
            {...props}
            pageSize={pageSize}
            current={current}
            total={dataSource.length}
            size={size}
            showSizeChanger={false}
            onChange={handleChange}
          />
        </Space>
      </div>
    );
  };

  return <>{props.children?.(dataSource?.slice(startIndex, endIndex + 1), renderPagination())}</>;
};

export const ArrayTable: ComposedArrayTable = observer((props: TableProps<any>) => {
  const ref = useRef<HTMLDivElement>();
  const field = useField<ArrayField>();
  const prefixCls = usePrefixCls('formily-array-table');
  const dataSource = Array.isArray(field.value) ? field.value.slice() : [];
  const sources = useArrayTableSources();
  const columns = useArrayTableColumns(dataSource, sources);
  const pagination = isBool(props.pagination) ? {} : props.pagination;

  const btn = useSchemaBtn();

  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record);
  };

  const addTdStyles = (node: Element) => {
    const helper = document.body.querySelector(`.${prefixCls}-sort-helper`);
    if (helper) {
      const tds = node.querySelectorAll('td');
      requestAnimationFrame(() => {
        helper.querySelectorAll('td').forEach((td, index) => {
          if (tds[index]) {
            td.style.width = getComputedStyle(tds[index]).width;
          }
        });
      });
    }
  };

  const handleRemove = (record, index) => {
    field.remove(index);
  };

  const handleAdd = () => {
    field.push({});
  };

  return (
    <ArrayTablePagination {...pagination} dataSource={dataSource}>
      {(dataSource, pager) => (
        <div ref={ref} className={prefixCls}>
          <ArrayBase onRemove={handleRemove} onAdd={handleAdd}>
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
              {...props}
              onChange={() => {}}
              pagination={false}
              columns={columns}
              dataSource={dataSource}
              components={{
                body: {
                  wrapper: (props: any) => (
                    <SortableBody
                      useDragHandle
                      lockAxis="y"
                      helperClass={`${prefixCls}-sort-helper`}
                      helperContainer={() => {
                        return ref.current?.querySelector('tbody');
                      }}
                      onSortStart={({ node }) => {
                        addTdStyles(node);
                      }}
                      onSortEnd={({ oldIndex, newIndex }) => {
                        field.move(oldIndex, newIndex);
                      }}
                      {...props}
                    />
                  ),
                  row: (props: any) => {
                    return <SortableRow index={props['data-row-key'] || 0} {...props} />;
                  },
                },
              }}
            />
            <div style={{ marginTop: 5, marginBottom: 5 }}>{pager}</div>

            <SchemaFragment schemaSource={sources} />
          </ArrayBase>
        </div>
      )}
    </ArrayTablePagination>
  );
});

export default ArrayTable;

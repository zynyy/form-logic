import { FC, Key, memo, useEffect, useMemo, useState } from 'react';
import { Form, setValidateLanguage, JSXComponent } from '@formily/core';
import { FormProvider } from '@formily/react';

import { Empty, Skeleton } from 'antd';

import useCreateSchemaField from '@/hooks/useSchemaField';

import { ISchema } from '@formily/react';
import { toArray } from '@/utils';
import { LIST_FILED_CODE } from '@/utils/constant';
import { ListTableProps } from '@/components/list-table';

import { useDOMRect } from '@formlogic/component';
import { RowSelectionType } from 'antd/es/table/interface';

export interface SchemeTableFormProps extends Omit<ListTableProps, 'onTableChange'> {
  schema: ISchema;
  form: Form;
  dataSource: any[];
  currentPage: number;
  total: number;
  pageSize: number;
  language?: string;
  loading?: boolean;
  rowKey?: string;
  hasRowSelection?: boolean;
  selectedRows?: any[];
  rowSelectionType?: RowSelectionType;
  components?: {
    [key: string]: JSXComponent;
  };
}

const SchemeTableForm: FC<SchemeTableFormProps> = ({
  schema,
  loading,
  language,
  components,
  dataSource,
  form,
  selectedRows: defaultSelectedRows,
  rowKey,
  hasRowSelection,
  rowSelection,
  onChange,
  currentPage,
  total,
  pageSize,
  rowSelectionType,
  ...restProps
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const SchemaField = useCreateSchemaField();

  const [scrollY, setScrollY] = useState(450);

  const [contentRect, domRef] = useDOMRect<HTMLDivElement>();

  const tableRowKey = useMemo(() => {
    return rowKey || 'id';
  }, [rowKey]);

  useEffect(() => {
    if (contentRect) {
      const { height } = contentRect;
      setScrollY(height - 140);
    }
  }, [contentRect]);

  useEffect(() => {
    setValidateLanguage(language ?? 'zh-CN');
  }, [language]);

  useEffect(() => {
    if (form.id) {
      form.setValuesIn(LIST_FILED_CODE, dataSource);
    }
  }, [form?.id, dataSource]);

  useEffect(() => {
    setSelectedRowKeys(defaultSelectedRows?.map((item: any) => item[tableRowKey]) || []);
    setSelectedRows(defaultSelectedRows || []);
  }, [defaultSelectedRows, tableRowKey]);

  const handleRowSelectionChange = (rowKeys: Key[], changeSelectedRows: any[], info) => {
    if (rowSelectionType === 'radio') {
      setSelectedRows(changeSelectedRows);
      setSelectedRowKeys(rowKeys);

      rowSelection?.onChange?.(rowKeys, changeSelectedRows, info);
    } else {
      const allDataSourceKey =
        toArray(dataSource).map((item: any, index) => item[tableRowKey] || index) || [];

      // 更新旧值选中的数据
      const selectedRowsMap = toArray(defaultSelectedRows).map((item: any) => {
        const record = changeSelectedRows.find(
          (current) => current[tableRowKey] === item[tableRowKey],
        );
        if (record) {
          return record;
        }
        return item;
      });

      const nextSelectedRows = selectedRowsMap
        .filter((item: any) => !allDataSourceKey.includes(item[tableRowKey]))
        .concat(changeSelectedRows.filter((item) => allDataSourceKey.includes(item[tableRowKey])));

      const nextSelectedRowKeys = nextSelectedRows.map((item: any) => item[tableRowKey]);

      setSelectedRows(nextSelectedRows);

      setSelectedRowKeys(nextSelectedRowKeys);

      rowSelection?.onChange?.(nextSelectedRowKeys, nextSelectedRows, info);
    }
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

  useEffect(() => {
    if (form) {
      form.query(LIST_FILED_CODE).take((target) => {
        target.setComponentProps({
          ...restProps,
          rowKey: tableRowKey,
          rowSelection: getRowSelectionConfig(),
          onTableChange: onChange,
          scrollY,
          pagination: {
            current: Number(currentPage),
            total,
            pageSize: Number(pageSize),
          },
        });
      });
    }
  });

  return (
    <Skeleton loading={!!loading}>
      <FormProvider form={form}>
        <div
          className={`form-id-${form?.id}`}
          style={{
            height: '100%',
          }}
          ref={domRef}
        >
          {schema ? (
            <SchemaField schema={schema} components={components} />
          ) : (
            <Empty description="暂无数据" />
          )}
        </div>
      </FormProvider>
    </Skeleton>
  );
};

SchemeTableForm.defaultProps = {
  loading: false,
  rowKey: 'id',
};

export default memo(SchemeTableForm);

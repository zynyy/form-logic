import { forwardRef, Key, memo, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Form, setValidateLanguage, IFormProps, JSXComponent } from '@formily/core';
import { FormProvider } from '@formily/react';

import { Empty, Skeleton, TableProps } from 'antd';

import { useCreateForm } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';

import { ISchema } from '@formily/json-schema';
import { toArray } from '@/utils';
import { LIST_FILED_CODE } from '@/utils/constant';
import { ListTableProps } from '@/components/list-table';

export interface SchemeTableFormProps extends Omit<ListTableProps, 'onTableChange'> {
  formConfig?: IFormProps;
  language?: string;
  schema?: ISchema;
  onFormMount?: (form: Form) => void;
  done?: boolean;
  form?: Form;
  dataSource: any[];
  defaultSelectValue?: any[];
  selectedRows?: any[];
  rowKey?: string;
  hasRowSelection?: boolean;
  currentPage?: number;
  total?: number;
  pageSize?: number;
  components?: {
    [key: string]: JSXComponent;
  };
}

export type SchemeTableFormRef = Form;

const SchemeTableForm = forwardRef<SchemeTableFormRef, SchemeTableFormProps>(
  (
    {
      formConfig,
      schema,
      done,
      language,
      components,
      dataSource,
      onFormMount,
      form: propsForm,
      defaultSelectValue,
      selectedRows: propsSelectedRows,
      rowKey,
      hasRowSelection,
      rowSelection,
      onChange,
      currentPage,
      total,
      pageSize,
      ...restProps
    },
    ref,
  ) => {
    const [warpForm] = useCreateForm(formConfig, onFormMount, propsForm);

    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    const [selectValue, setSelectValue] = useState<any[]>([]);

    const SchemaField = useCreateSchemaField();

    const tableRowKey = useMemo(() => {
      return rowKey || 'id';
    }, [rowKey]);

    useImperativeHandle(ref, () => {
      return warpForm;
    });

    useEffect(() => {
      setValidateLanguage(language ?? 'zh-CN');
    }, [language]);

    useEffect(() => {
      if (warpForm.id) {
        warpForm.setValuesIn(LIST_FILED_CODE, dataSource);
      }
    }, [warpForm?.id, dataSource]);

    useEffect(() => {
      setSelectedRowKeys(defaultSelectValue?.map((item: any) => item[tableRowKey]) || []);
      setSelectValue(defaultSelectValue || []);
    }, [defaultSelectValue, tableRowKey]);

    const getRowSelectionConfig = () => {
      if (hasRowSelection) {
        return {
          ...rowSelection,
          selectedRowKeys,
          onChange: (rowKeys: Key[], selectedRows: any[], info) => {
            const allDataSourceKey =
              toArray(dataSource).map((item: any, index) => item[tableRowKey] || index) || [];

            selectedRows = selectedRows.map((item) => {
              const key = item[tableRowKey];

              const isDefaultValue = (defaultSelectValue || []).find(
                (defaultValueItem) => defaultValueItem[tableRowKey] === key,
              );

              const isDataSourceValue = (dataSource || []).find(
                (dataSourceItem: any) => dataSourceItem[tableRowKey] === key,
              );

              if (!isDefaultValue && isDataSourceValue) {
                item = {
                  ...isDataSourceValue,
                };
              } else {
                item = {
                  ...isDefaultValue,
                };
              }
              return item;
            });

            setSelectValue(
              rowSelection?.type === 'radio'
                ? selectedRows
                : selectedRows
                    .concat(
                      selectValue.filter((item: any) => {
                        return !selectedRows.find(
                          (current) => current[tableRowKey] === item[tableRowKey],
                        );
                      }),
                    )
                    .filter((val) => val),
            );

            const mapValue = toArray(propsSelectedRows)
              .map((item: any) => {
                return selectValue.find((current) => current[tableRowKey] === item[tableRowKey]);
              })
              .filter((val: any) => val);

            const changeValue = mapValue
              .filter((item: any) => !allDataSourceKey.includes(item[tableRowKey]))
              .concat(selectedRows.filter((item) => allDataSourceKey.includes(item[tableRowKey])));

            setSelectedRowKeys(changeValue.map((item: any) => item[tableRowKey]));

            rowSelection?.onChange?.(
              changeValue.map((item: any) => item[tableRowKey]),
              changeValue,
              info,
            );
          },
        };
      }
      return null;
    };

    useEffect(() => {
      if (warpForm) {
        warpForm.query(LIST_FILED_CODE).take((target) => {
          target.setComponentProps({
            ...restProps,
            rowKey: tableRowKey,
            rowSelection: getRowSelectionConfig(),
            onTableChange: onChange,
            pagination: {
              current: currentPage,
              total,
              pageSize,
            },
          });
        });
      }
    });

    return (
      <Skeleton loading={!done}>
        <FormProvider form={warpForm}>
          <form className={`form-id-${warpForm.id}`}>
            {schema ? (
              <SchemaField schema={schema} components={components} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </form>
        </FormProvider>
      </Skeleton>
    );
  },
);

SchemeTableForm.defaultProps = {
  done: true,
  rowKey: 'id',
};

export default memo(SchemeTableForm);

import SchemaLayout from '@/components/schema-layout/SchemaLayout';
import WhereLayout from '@/components/schema-layout/WhereLayout';
import SchemeForm from '@/scheme-form';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { Form, IFormProps, isArrayField, isField, onFieldInit } from '@formily/core';

import { Button, Space, Spin } from 'antd';

import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { getSubmitFormValues } from '@/utils/getSubmitFormValues';
import { ISchema } from '@formily/json-schema';
import { requestGet } from '@/utils/request';
import { useCreateForm } from '@/hooks';
import { AnyObject } from '@/interface';

export interface ListNormalProps {
  searchSchema?: ISchema;
  tableSchema?: ISchema;
  hasCollapsed?: boolean;
  searchFormConfig?: IFormProps;
  tableFormConfig?: IFormProps;
  action: string;
  onTableMount?: (form: Form) => void;
  onSearchMount?: (form: Form) => void;
  extraSearchParams?: AnyObject;
  transformSearchParams?: (searchParams: AnyObject) => AnyObject;
}

export interface ListNormalRef {
  searchForm: Form;
  dataTableForm: Form;
}

const ListNormal = forwardRef<ListNormalRef, ListNormalProps>(
  (
    {
      searchSchema,
      action,
      tableSchema,
      hasCollapsed,
      searchFormConfig,
      onSearchMount,
      onTableMount,
      tableFormConfig,
      transformSearchParams,
      extraSearchParams,
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);

    const [searchForm] = useCreateForm(searchFormConfig, onSearchMount);
    const [dataTableForm] = useCreateForm(tableFormConfig, onTableMount);

    const initSearch = () => {
      handleSearch();
    };

    useImperativeHandle(ref, () => {
      return {
        searchForm,
        dataTableForm,
      };
    });

    const handleRestClick = () => {
      searchForm.reset();
    };

    const handleCollapsedClick = (collapsed: boolean) => {
      searchForm.query('*').forEach((target) => {
        if (isField(target) && target?.data?.hiddenSearchColumn) {
          target.setDisplay(collapsed ? 'visible' : 'hidden');
          if (collapsed) {
            target.reset();
          }
        }
      });
    };

    const handleSearch = () => {
      getSubmitFormValues(searchForm).then((formValues) => {
        setLoading(true);

        const params = {
          ...formValues,
          ...extraSearchParams,
        };

        requestGet(action, transformSearchParams?.(params) || params)
          .then((res) => {
            const { data } = res || {};

            dataTableForm.query('dataSource').take((target) => {
              if (isArrayField(target)) {
                target.onInput(data).then(() => void 0);
              }
            });
          })
          .finally(() => {
            setLoading(false);
          });
      });
    };

    useEffect(() => {
      if (dataTableForm?.id) {
        dataTableForm.addEffects('init', () => {
          onFieldInit('dataSource', () => {
            initSearch();
          });
        });
      }
      return () => {
        dataTableForm?.removeEffects('init');
      };
    }, [dataTableForm?.id]);

    return (
      <Spin spinning={loading}>
        <SchemaLayout
          header={
            <WhereLayout
              title="搜索条件"
              onCollapsedClick={handleCollapsedClick}
              hasCollapsed={hasCollapsed}
              buttons={
                <Space>
                  <Button icon={<ClearOutlined />} type="dashed" onClick={handleRestClick}>
                    重置
                  </Button>
                  <Button icon={<SearchOutlined />} type="primary" onClick={handleSearch}>
                    搜索
                  </Button>
                </Space>
              }
            >
              <SchemeForm schema={searchSchema} form={searchForm} />
            </WhereLayout>
          }
        >
          <SchemeForm form={dataTableForm} schema={tableSchema} />
        </SchemaLayout>
      </Spin>
    );
  },
);

export default ListNormal;

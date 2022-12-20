import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { AnyObject, EventsObject, LogicConfig, MetaSchema } from '@/interface';
import { Form, IFormProps, isArrayField, isField, onFieldInit } from '@formily/core';
import {
  useBindBtnClick,
  useBindLogic,
  useCreateForm,
  useListSchema,
  useTransformsOptions,
} from '@/hooks';
import { Button, Skeleton, Space, Spin } from 'antd';

import SchemaLayout from '@/components/schema-layout/SchemaLayout';
import WhereLayout from '@/components/schema-layout/WhereLayout';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import SchemeForm from '@/scheme-form';
import { getSubmitFormValues } from '@/utils/getSubmitFormValues';
import { requestGet } from '@/utils/request';
import { ISchema } from '@formily/json-schema';

export interface ListLayoutProps {
  metaSchema?: MetaSchema;
  searchFormConfig?: IFormProps;
  pageCode?: string;
  action: string;
  getLogicConfig?: LogicConfig;
  events?: EventsObject;
  searchSchema?: ISchema;
  tableSchema?: ISchema;
  hasCollapsed?: boolean;
  tableFormConfig?: IFormProps;
  onTableMount?: (form: Form) => void;
  onSearchMount?: (form: Form) => void;
  extraSearchParams?: AnyObject;
  transformSearchParams?: (searchParams: AnyObject) => AnyObject;
  extraLogicParams?: {
    [key: string]: any;
  };
}

export interface ListLayoutRef {}

const ListLayout = forwardRef<ListLayoutRef, ListLayoutProps>(
  (
    {
      metaSchema,
      pageCode,
      searchFormConfig,
      action,
      getLogicConfig,
      extraLogicParams,
      extraSearchParams,
      transformSearchParams,
      onSearchMount,
      onTableMount,
      events,
    },
    ref,
  ) => {
    const [loading, options] = useTransformsOptions({
      pageCode,
      metaSchema,
    });

    const listSchema = useListSchema(options);

    const [searchLoading, setSearchLoading] = useState(false);

    const {
      searchSchema,
      tableSchema,
      hasCollapsed,
      searchLogic,
      tableLogic,
      searchBtnFields,
      tableBtnFields,
    } = listSchema;

    const [searchForm] = useCreateForm(searchFormConfig, onSearchMount);
    const [dataTableForm] = useCreateForm({}, onTableMount);

    useBindBtnClick(
      searchForm,
      searchBtnFields,
      getLogicConfig,
      extraLogicParams,
      events,
      () => {},
    );

    useBindBtnClick(
      dataTableForm,
      tableBtnFields,
      getLogicConfig,
      extraLogicParams,
      events,
      () => {},
    );

    const [searchDone] = useBindLogic(
      searchForm,
      searchSchema,
      searchLogic,
      getLogicConfig,
      extraLogicParams,
      () => {},
    );

    const [tableDone] = useBindLogic(
      dataTableForm,
      tableSchema,
      tableLogic,
      getLogicConfig,
      extraLogicParams,
      () => {},
    );

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
        setSearchLoading(true);

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
            setSearchLoading(false);
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
      <>
        <Spin spinning={searchLoading}>
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
                <SchemeForm done={searchDone} schema={searchSchema} form={searchForm} />
              </WhereLayout>
            }
          >
            <SchemeForm done={tableDone} schema={tableSchema} form={dataTableForm} />
          </SchemaLayout>
        </Spin>
      </>
    );
  },
);

export default ListLayout;

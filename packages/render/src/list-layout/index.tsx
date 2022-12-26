import { FC, useEffect, useState } from 'react';
import { AnyObject, EventsObject, LogicConfig, MetaSchema } from '@/interface';
import { Form, IFormProps, isField } from '@formily/core';
import {
  useBindBtnClick,
  useBindLogic,
  useCreateForm,
  useListSchema,
  useTransformsOptions,
  useTriggerLogic,
} from '@/hooks';
import { Button, Space, Spin } from 'antd';

import SchemaLayout from '@/components/schema-layout/SchemaLayout';
import WhereLayout from '@/components/schema-layout/WhereLayout';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import SchemeForm from '@/scheme-form';
import { getSubmitFormValues } from '@/utils/getSubmitFormValues';
import { requestGet } from '@/utils/request';
import SchemeTableForm from '@/scheme-table-form';

export interface ListLayoutProps {
  action: string;
  pageCode?: string;
  metaSchema?: MetaSchema;
  searchFormConfig?: IFormProps;
  getLogicConfig?: LogicConfig;
  events?: EventsObject;
  tableFormConfig?: IFormProps;
  onTableMount?: (form: Form) => void;
  onSearchMount?: (form: Form) => void;
  extraSearchParams?: AnyObject;
  transformSearchParams?: (searchParams: AnyObject) => AnyObject;
  extraLogicParams?: {
    [key: string]: any;
  };
}

const ListLayout: FC<ListLayoutProps> = ({
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
}) => {
  const [options] = useTransformsOptions({
    pageCode,
    metaSchema,
  });

  const [dataSource, setDataSource] = useState([]);

  const listSchema = useListSchema(options);

  const [searchLoading, setSearchLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [total, setTotal] = useState(0);

  const {
    searchSchema,
    tableSchema,
    hasCollapsed,
    searchLogic,
    tableLogic,
    tableBtnFields,
    searchButtons,
  } = listSchema;

  const [searchForm] = useCreateForm(searchFormConfig, onSearchMount);
  const [dataTableForm] = useCreateForm({}, onTableMount);

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

  const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {});

  const initSearch = () => {
    handleSearch();
  };

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
      const params = {
        ...formValues,
        ...extraSearchParams,
      };
      setSearchLoading(true);
      requestGet(action, transformSearchParams?.(params) || params)
        .then((res) => {
          const { data } = res || {};

          setDataSource(data);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    });
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { action } = extra || {};

    if (action === 'paginate') {
      setCurrentPage(pagination.current);
      setPageSize(pagination.pageSize);
    }
  };

  useEffect(() => {
    if (tableDone) {
      initSearch();
    }
  }, [tableDone]);

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
                  {searchButtons.map((item) => {
                    const { name, logics, eventCode } = item || {};

                    const clickCodes =
                      logics
                        ?.filter((item) => item.event === 'onClick')
                        ?.map((item) => item.logicCode) || [];

                    return (
                      <Button
                        key={name}
                        onClick={(e) => {
                          if (events?.[eventCode]) {
                            events[eventCode](e, searchForm);
                            return;
                          }

                          if (clickCodes.length) {
                            triggerLogic(clickCodes, {
                              params: extraLogicParams,
                              form: searchForm,
                            });
                          }
                        }}
                      >
                        {name}
                      </Button>
                    );
                  })}

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
          <SchemeTableForm
            dataSource={dataSource}
            form={dataTableForm}
            done={tableDone}
            schema={tableSchema}
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onChange={handleTableChange}
          />
        </SchemaLayout>
      </Spin>
    </>
  );
};

export default ListLayout;

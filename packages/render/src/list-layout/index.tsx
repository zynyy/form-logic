import { FC, useEffect, useState } from 'react';
import { AnyObject, EventsObject, LogicConfig, MetaSchema, SchemaPatternEnum } from '@/interface';
import { Form, IFormProps, isField } from '@formily/core';
import { useTransformsOptions, useTriggerLogic } from '@/hooks';

import WhereLayout from '@/components/schema-layout/WhereLayout';

import SchemeForm from '@/scheme-form';

import { requestGet } from '@/utils/request';
import SchemeTableForm, { SchemeTableFormProps } from '@/scheme-table-form';
import { ListLayoutContent } from '@/list-layout/hooks/content';

import { getSubmitFormValues } from '@/utils/formUtils';
import { Layout } from '@formlogic/component';
import useListPageForm from '@/hooks/useListPageForm';

export interface ListLayoutProps
  extends Omit<
    SchemeTableFormProps,
    'form' | 'done' | 'schema' | 'total' | 'currentPage' | 'onChange' | 'pageSize' | 'dataSource'
  > {
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
  reloadFlag?: number;
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
  reloadFlag,
  components,
  language,
  ...tableProps
}) => {
  const [options] = useTransformsOptions({
    pageCode,
    metaSchema,
  });

  const [dataSource, setDataSource] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    searchForm,
    hasCollapsed,
    tableFormLoading,
    tableSchema,
    searchSchema,
    searchButtons,
    dataTableForm,
    searchFormLoading,
  } = useListPageForm({
    options,
    events,
    getLogicConfig,
    logicParams: {
      ...extraSearchParams,
      setSearchLoading,
      cb: () => {
        search(currentPage, pageSize);
      },
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [total, setTotal] = useState(0);

  const [prevReload, setPrevReloadFlag] = useState(reloadFlag);

  const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {});

  const handleButtonItemClick = (
    e,
    code: string,
    eventCode: string | undefined,
    clickCodes: string[],
  ) => {
    if (eventCode && events?.[eventCode]) {
      events[eventCode](e, searchForm);
      return;
    }

    if (clickCodes.length) {
      triggerLogic(clickCodes, {
        params: extraLogicParams,
        form: searchForm,
        effectHook: 'onClick',
        fieldCode: code,
        pageCode: metaSchema?.code,
      });
    }
  };

  const initSearch = () => {
    search(1, pageSize);
  };

  const handleRestClick = () => {
    searchForm.reset().then(() => void 0);
    search(1, pageSize);
  };

  const handleCollapsedClick = (collapsed: boolean) => {
    searchForm.query('*').forEach((target) => {
      if (isField(target) && target?.data?.hiddenSearchColumn) {
        target.setDisplay(collapsed ? 'visible' : 'hidden');
        if (collapsed) {
          target.reset().then(() => void 0);
        }
      }
    });
  };

  const search = (nextCurrent: number, nextPageSize: number) => {
    if (!action) return;

    getSubmitFormValues(searchForm).then((formValues) => {
      const params = {
        ...formValues,
        ...extraSearchParams,
        current: nextCurrent ?? currentPage,
        pageSize: nextPageSize ?? pageSize,
      };
      setSearchLoading(true);

      requestGet(action, transformSearchParams?.(params) || params)
        .then((res) => {
          const { data } = res || {};

          const { list, total, current, pageSize } = data || {};

          setCurrentPage(current);
          setPageSize(pageSize);

          setTotal(total);

          setDataSource(list);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    });
  };

  const handleSearch = () => {
    search(1, pageSize);
  };

  const callbackSearch = () => {
    search(currentPage, pageSize);
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { action } = extra || {};

    if (action === 'paginate') {
      const { current: nextCurrent, pageSize: nextPageSize } = pagination || {};
      search(nextCurrent, nextPageSize);
      setCurrentPage(nextCurrent);
      setPageSize(nextPageSize);
    }
  };

  useEffect(() => {
    if (!tableFormLoading) {
      initSearch();
    }
  }, [tableFormLoading]);

  useEffect(() => {
    if (reloadFlag > 0 && prevReload !== reloadFlag) {
      setPrevReloadFlag(reloadFlag);
      search(1, pageSize);
    }
  }, [reloadFlag, pageSize, prevReload]);

  return (
    <ListLayoutContent.Provider
      value={{
        loading: searchLoading,
        setLoading: setSearchLoading,
        cb: callbackSearch,
      }}
    >
      <Layout
        loading={searchLoading}
        header={
          <WhereLayout
            title="搜索条件"
            onCollapsedClick={handleCollapsedClick}
            hasCollapsed={hasCollapsed}
            buttons={searchButtons}
            onRestClick={handleRestClick}
            onSearchClick={handleSearch}
            onButtonItemClick={handleButtonItemClick}
          >
            <SchemeForm
              loading={searchFormLoading}
              schema={searchSchema}
              form={searchForm}
              pattern={SchemaPatternEnum.EDITABLE}
              getLogicConfig={getLogicConfig}
              extraLogicParams={extraLogicParams}
              events={events}
              components={components}
              language={language}
            />
          </WhereLayout>
        }
      >
        <SchemeTableForm
          {...tableProps}
          dataSource={dataSource}
          form={dataTableForm}
          loading={tableFormLoading}
          schema={tableSchema}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onChange={handleTableChange}
          components={components}
          language={language}
          hasClearSelectedRows
        />
      </Layout>
    </ListLayoutContent.Provider>
  );
};

export default ListLayout;

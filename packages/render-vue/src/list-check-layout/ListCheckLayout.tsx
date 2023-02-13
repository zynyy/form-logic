import { computed, defineComponent, onMounted, reactive, ref, toRef, watch } from 'vue';
import { useListPageForm, useTransformsOptions } from '@/hooks';
import { useTriggerLogic } from '@/hooks/useLogic';
import { isField } from '@formily/core';
import { getSubmitFormValues } from '@/utils/formUtils';
import { requestGet } from '@/utils/request';
import { provideListLayoutContext } from '@/list-layout/hooks';
import Layout from '@/components/layout';
import WhereLayout from '@/components/where-layout';
import SchemeForm from '@/scheme-form';
import { SchemaPatternEnum } from '@/interface';
import SchemeTableForm from '@/scheme-table-form/SchemeTableForm';
import { getListCheckLayoutProps, ListCheckLayoutProps } from '@/list-check-layout/interface';

const ListCheckLayout = defineComponent({
  name: 'ListCheckLayout',
  props: getListCheckLayoutProps(),
  inheritAttrs: false,
  setup(props: ListCheckLayoutProps, { attrs }) {
    const searchLoading = ref(false);

    const paginationRef = reactive({
      currentPage: 1,
      pageSize: 30,
      total: 0,
    });

    const setSearchLoading = (nextLoading: boolean) => {
      searchLoading.value = nextLoading;
    };

    const pageCodeRef = toRef(props, 'pageCode');
    const metaSchemaRef = toRef(props, 'metaSchema');

    const { options } = useTransformsOptions({
      pageCode: pageCodeRef,
      metaSchema: metaSchemaRef,
    });

    const dataSource = ref([]);

    const listPageFormRef = useListPageForm({
      options,
      events: props.events,
      getLogicConfig: props.getLogicConfig,
      onSearchMount: props.onSearchMount,
      onTableMount: props.onTableMount,
      logicParams: {
        ...props.extraSearchParams,
        setSearchLoading,
        cb: () => {
          const { currentPage, pageSize } = paginationRef;
          search(currentPage, pageSize);
        },
      },
    });

    const [triggerLogic] = useTriggerLogic(props.getLogicConfig, () => {});

    const handleButtonItemClick = (e, record) => {
      const { events, extraLogicParams } = props;

      const { eventCode, code, clickCodes } = record;
      const { searchForm, dataTableForm } = listPageFormRef.value;

      if (eventCode && events?.[eventCode]) {
        return events[eventCode](e, {
          code,
          searchForm,
          tableForm: dataTableForm,
          setSearchLoading,
        });
      }

      if (clickCodes.length) {
        triggerLogic(clickCodes, {
          params: extraLogicParams,
          form: searchForm,
          effectHook: 'onClick',
          fieldCode: code,
          pageCode: options.value.metaSchema?.code,
        });
      }
    };

    const initSearch = () => {
      const { pageSize } = paginationRef;
      search(1, pageSize);
    };

    const handleRestClick = () => {
      const { searchForm } = listPageFormRef.value;
      searchForm.reset().then(() => void 0);
      const { pageSize } = paginationRef;
      search(1, pageSize);
    };

    const handleCollapsedClick = (collapsed: boolean) => {
      const { searchForm } = listPageFormRef.value;
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
      const { action, extraSearchParams, transformSearchParams, hasPageQuery } = props;

      const { searchForm } = listPageFormRef.value;

      if (!action) return;

      getSubmitFormValues(searchForm).then((formValues) => {
        const { currentPage, pageSize } = paginationRef;
        const params = hasPageQuery
          ? {
              ...formValues,
              ...extraSearchParams,
              current: nextCurrent ?? currentPage,
              pageSize: nextPageSize ?? pageSize,
            }
          : {
              ...formValues,
              ...extraSearchParams,
            };

        setSearchLoading(true);

        const searchParams = transformSearchParams?.(params) || params;

        requestGet(action, searchParams)
          .then((res) => {
            const { data } = res || {};

            if (hasPageQuery) {
              const { list, total, current, pageSize } = data || {};

              paginationRef.currentPage = current;
              paginationRef.pageSize = pageSize;
              paginationRef.total = total;

              dataSource.value = list;
            } else {
              if (nextCurrent) {
                paginationRef.currentPage = nextCurrent;
              }

              if (nextPageSize) {
                paginationRef.pageSize = nextPageSize;
              }
              dataSource.value = data;
            }
          })
          .finally(() => {
            setSearchLoading(false);
          });
      });
    };

    const handleSearch = () => {
      const { pageSize } = paginationRef;
      search(1, pageSize);
    };

    const callbackSearch = () => {
      const { currentPage, pageSize } = paginationRef;

      search(currentPage, pageSize);
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
      const { action } = extra || {};
      const { hasPageQuery } = props;

      if (action === 'paginate') {
        const { current: nextCurrent, pageSize: nextPageSize } = pagination || {};

        if (hasPageQuery) {
          search(nextCurrent, nextPageSize);
        }

        paginationRef.currentPage = nextCurrent;
        paginationRef.pageSize = nextPageSize;
      }
    };

    onMounted(() => {
      if (!listPageFormRef.value.tableFormLoading) {
        initSearch();
      }
    });

    watch(
      () => listPageFormRef.value.tableFormLoading,
      (nextTableFormLoading) => {
        if (!nextTableFormLoading) {
          initSearch();
        }
      },
    );

    watch(
      () => props.reloadFlag,
      () => {
        const { pageSize } = paginationRef;
        search(1, pageSize);
      },
    );

    provideListLayoutContext(
      computed(() => {
        return {
          cb: callbackSearch,
          loading: searchLoading.value,
          setLoading: setSearchLoading,
        };
      }),
    );

    return () => {
      const { events, extraLogicParams, getLogicConfig, components, language, ...tableProps } =
        props;

      const {
        hasCollapsed,
        searchSchema,
        searchForm,
        searchFormLoading,
        searchButtons,
        dataTableForm,
        tableFormLoading,
        tableSchema,
      } = listPageFormRef.value;

      const { pageSize, currentPage, total } = paginationRef;

      return (
        <Layout
          loading={searchLoading.value}
          v-slots={{
            header: () => {
              return (
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
              );
            },
          }}
        >
          <SchemeTableForm
            hasClearSelectedRows
            {...tableProps}
            dataSource={dataSource.value}
            form={dataTableForm}
            loading={tableFormLoading}
            schema={tableSchema}
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            onChange={handleTableChange}
            components={components}
            language={language}
            hasRowSelection
          />
        </Layout>
      );
    };
  },
});

export default ListCheckLayout;

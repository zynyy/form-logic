import { setValidateLanguage } from '@formily/core';

import { FormProvider } from '@/formily-vue';
import { computed, defineComponent, ref, toRef, onMounted, watchEffect, watch } from 'vue';
import { Empty, Skeleton } from 'ant-design-vue';

import { useNotifyDevtools } from '@/hooks';
import useCreateSchemaField from '@/hooks/useSchemaField';

import { SchemeTableFormProps, getSchemeTableFormProps } from './interface';

import useDOMRect from '@/hooks/dom/useDOMRect';
import { Key } from 'ant-design-vue/lib/_util/type';
import { useItemKey } from '@/components/array-base';
import { toArray } from '@/utils';
import { LIST_FILED_CODE } from '@/utils/constant';

const SchemeTableForm = defineComponent({
  name: 'SchemeTableForm',
  inheritAttrs: false,
  props: getSchemeTableFormProps(),
  setup(props: SchemeTableFormProps) {
    const { components } = props;

    const dataSourceRef = toRef(props, 'dataSource');
    const formRef = toRef(props, 'form');
    const defaultSelectedRowsRef = toRef(props, 'selectedRows');

    const SchemaField = useCreateSchemaField();

    const [contentRect, domRef] = useDOMRect<HTMLDivElement>();

    useNotifyDevtools(toRef(props, 'form'));

    const selectedRowKeys = ref<Key[]>([]);

    const selectedRows = ref<any[]>([]);

    const setSelectedRows = (nextSelectedRows: any[]) => {
      selectedRows.value = nextSelectedRows;
    };

    const setSelectedRowKeys = (nextSelectedRowKeys: Key[]) => {
      selectedRowKeys.value = nextSelectedRowKeys;
    };

    watchEffect(() => {
      setValidateLanguage(props.language ?? 'zh-CN');
    });

    const scrollY = ref(450);

    const { getRecordKey } = useItemKey(true);

    const tableRowKey = (record: any) => {
      const { rowKey } = props;

      if (typeof rowKey === 'function') {
        return rowKey(record);
      }

      return record[rowKey] || getRecordKey(record);
    };

    watchEffect(() => {
      if (contentRect.value) {
        const { height } = contentRect.value;

        scrollY.value = height - 140;
      }
    });

    watchEffect(() => {
      const form = formRef.value;
      const dataSource = dataSourceRef.value;
      const { hasClearSelectedRows } = props;

      if (form.id) {
        form.setValuesIn(LIST_FILED_CODE, dataSource);

        if (hasClearSelectedRows) {
          setSelectedRows([]);
          setSelectedRowKeys([]);
        }
      }
    });

    watchEffect(() => {
      const defaultSelectedRows = defaultSelectedRowsRef.value;

      setSelectedRowKeys(defaultSelectedRows?.map((item: any) => tableRowKey(item)) || []);
      setSelectedRows(defaultSelectedRows || []);
    });

    const handleRowSelectionChange = (rowKeys: Key[], changeSelectedRows: any[], info) => {
      const {
        rowSelectionType,
        rowSelection,
        selectedRows: defaultSelectedRows,
        dataSource,
      } = props;

      if (rowSelectionType === 'radio') {
        setSelectedRows(changeSelectedRows);
        setSelectedRowKeys(rowKeys);

        // @ts-ignore
        rowSelection?.onChange?.(rowKeys, changeSelectedRows, info);
      } else {
        const allDataSourceKey =
          toArray(dataSource).map((item: any, index) => tableRowKey(item) || index) || [];

        // 更新旧值选中的数据
        const selectedRowsMap = toArray(defaultSelectedRows).map((item: any) => {
          const record = changeSelectedRows.find(
            (current) => tableRowKey(current) === tableRowKey(item),
          );
          if (record) {
            return record;
          }
          return item;
        });

        const nextSelectedRows = selectedRowsMap
          .filter((item: Record<string, any>) => !allDataSourceKey.includes(tableRowKey(item)))
          .concat(
            changeSelectedRows.filter((item) => allDataSourceKey.includes(tableRowKey(item))),
          );

        const nextSelectedRowKeys = nextSelectedRows.map((item: any) => tableRowKey(item));

        setSelectedRows(nextSelectedRows);

        setSelectedRowKeys(nextSelectedRowKeys);
        // @ts-ignore
        rowSelection?.onChange?.(nextSelectedRowKeys, nextSelectedRows, info);
      }
    };

    const getRowSelectionConfig = computed(() => {
      const { hasRowSelection, rowSelection, rowSelectionType } = props;
      if (hasRowSelection) {
        return {
          // @ts-ignore
          ...rowSelection,
          selectedRowKeys: selectedRowKeys.value,
          selectedRows: selectedRows.value,
          type: rowSelectionType ?? 'checkbox',
          onChange: handleRowSelectionChange,
        };
      }
      return null;
    });

    const setComponentProps = () => {
      const form = formRef.value;
      const { onChange, pageSize, currentPage, total, tableLoading, ...restProps } = props;

      form.query(LIST_FILED_CODE).take((target) => {
        target.setComponentProps({
          ...restProps,
          loading: tableLoading,
          rowKey: tableRowKey,
          rowSelection: getRowSelectionConfig.value,
          onTableChange: onChange,
          selectedRowKeys: selectedRowKeys.value,
          setSelectedRowKeys,
          selectedRows: selectedRows.value,
          setSelectedRows,
          scrollY: scrollY.value,
          pagination: {
            pageSize: Number(pageSize ?? 30),
            current: Number(currentPage ?? 1),
            total: Number(total ?? 0),
          },
        });
      });
    };

    onMounted(() => {
      setComponentProps();
    });

    watch([getRowSelectionConfig, scrollY], () => {
      setComponentProps();
    });

    watch(
      () => {
        return {
          ...props,
        };
      },
      () => {
        setComponentProps();
      },
    );

    return () => {
      const { schema, form, loading } = props;

      return (
        <Skeleton loading={!!loading}>
          <FormProvider form={form}>
            <div
              class={`form-id-${form?.id}`}
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
  },
});

export default SchemeTableForm;

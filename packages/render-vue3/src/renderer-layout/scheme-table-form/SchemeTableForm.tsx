import {
  clone,
  formatComponentProps,
  FormProvider,
  setValidateLanguage,
} from '@formlogic/render-core-vue3';
import { ElEmpty , ElSkeleton  } from 'element-plus';
import { merge, omit } from 'lodash-es';
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  toRef,
  watch,
  watchEffect,
} from 'vue';

import { useNotifyDevtools } from '@/hooks';
import useDOMRect from '@/hooks/dom/useDOMRect';
import useCreateSchemaField from '@/hooks/useSchemaField';
import { LIST_FILED_CODE } from '@/utils/constant';

import { getSchemeTableFormProps, SchemeTableFormProps } from './interface';

const SchemeTableForm = defineComponent({
  name: 'SchemeTableForm',
  inheritAttrs: false,
  props: getSchemeTableFormProps(),
  setup(props: SchemeTableFormProps, { listeners }) {
    const { components } = props;

    const dataSourceRef = toRef(props, 'dataSource');
    const formRef = toRef(props, 'form');
    const defaultSelectedRowsRef = toRef(props, 'selectedRows');

    const SchemaField = useCreateSchemaField();

    const [contentRect, domRef] = useDOMRect<HTMLDivElement>();

    useNotifyDevtools(toRef(props, 'form'));

    const selectedRows = ref<any[]>([]);

    const setSelectedRows = (nextSelectedRows: any[]) => {
      selectedRows.value = nextSelectedRows;
    };

    watchEffect(() => {
      setValidateLanguage(props.language ?? 'zh-CN');
    });

    const scrollY = ref(450);

    watchEffect(() => {
      if (contentRect.value) {
        const { height } = contentRect.value;

        scrollY.value = height - 140;
      }
    });

    const agGridOptions = computed(() => {
      return merge({});
    });

    watch(
      () => {
        const form = formRef.value;
        const dataSource = dataSourceRef.value;
        const { hasClearSelectedRows } = props;

        return {
          form,
          dataSource,
          hasClearSelectedRows,
        };
      },
      ({ form, dataSource, hasClearSelectedRows }) => {},
      {
        immediate: true,
      },
    );

    watchEffect(() => {
      const defaultSelectedRows = defaultSelectedRowsRef.value;
      setSelectedRows(defaultSelectedRows || []);
    });

    const inject = () => {
      const form = formRef.value;
      form.query(LIST_FILED_CODE).take((target) => {
        target.inject({
          selectedRows: () => {
            return selectedRows.value;
          },
          setSelectedRows: () => {
            return setSelectedRows;
          },
        });
      });
    };

    const setComponentProps = () => {
      const form = formRef.value;

      const {
        hasPagination,
        pageSize,
        currentPage,
        total,
        tableLoading,
        title,
        hasMasterDetail,
        rowKey,
        childRowKey,
        ...restProps
      } = props;

      const formatProps = formatComponentProps({
        on: listeners,
        props: restProps,
      });

      form.query(LIST_FILED_CODE).take((target) => {
        const componentProps: Record<string, any> = {
          ...formatProps,
          loading: tableLoading,
          pagination: {
            pageSize: Number(pageSize ?? 30),
            current: Number(currentPage ?? 1),
            total: Number(total ?? 0),
          },
        };

        nextTick(() => {
          target.setComponentProps(
            omit(componentProps, [
              'schema',
              'language',
              'hasClearSelectedRows',
              'form',
              'dataSource',
              'selectedRows',
            ]),
          );
        });
      });
    };

    onMounted(() => {
      setComponentProps();
      inject();
    });

    watch(
      () => {
        return {
          ...omit(props, 'dataSource'),
          agGridOptions: agGridOptions.value,
        };
      },
      () => {
        setComponentProps();
      },
      { immediate: true },
    );

    return () => {
      const { schema, form, loading } = props;
      const formId = form?.id || 'formId';

      return (
        <ElSkeleton
          style={{
            height: '100%',
          }}
          loading={loading}
          animated
          throttle={500}
        >
          <FormProvider key={formId} form={form}>
            <div
              class={`form-id-${form?.id}`}
              style={{
                height: '100%',
              }}
              ref={domRef}
            >
              {schema ? (
                <SchemaField schema={clone(schema)} components={components} />
              ) : (
                <ElEmpty description="暂无数据" />
              )}
            </div>
          </FormProvider>
        </ElSkeleton>
      );
    };
  },
});

export default SchemeTableForm;

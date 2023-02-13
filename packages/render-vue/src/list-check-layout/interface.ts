import { ExtractPropTypes, PropType } from 'vue';
import { Components, EventsObject, LogicConfig, MetaSchema } from '@/interface';
import { Form, IFormProps } from '@formily/core';

import { TableRowSelection } from 'ant-design-vue/lib/table/interface';
import { getSchemeTableFormProps } from '@/scheme-table-form';
import { getArrayBaseEvent } from '@/components/array-base';

export type RowSelectedProps = Omit<TableRowSelection, 'selectedRowKeys' | 'type' | 'selectedRows'>;

export const getListCheckLayoutProps = () => {
  const { hasClearSelectedRows, rowKey, selectedRows } = getSchemeTableFormProps();

  return {
    selectedRows,
    rowKey,
    ...getArrayBaseEvent(),
    hasClearSelectedRows,
    language: String,
    action: {
      type: String,
      required: true as const,
    },
    pageCode: String,
    cacheKey: String,
    reloadFlag: Number,
    loading: {
      type: Boolean,
    },
    hasPageQuery: {
      type: Boolean,
      default: true as const,
    },
    metaSchema: {
      type: Object as PropType<MetaSchema>,
    },

    events: {
      type: Object as PropType<EventsObject>,
    },
    onSearchMount: {
      type: Function as PropType<(form: Form) => void>,
    },
    onTableMount: {
      type: Function as PropType<(form: Form) => void>,
    },

    formConfig: {
      type: Object as PropType<IFormProps>,
    },

    extraLogicParams: {
      type: Object as PropType<Record<string, any>>,
    },
    getLogicConfig: {
      type: Function as PropType<LogicConfig>,
      required: true as const,
    },
    extraSearchParams: null,
    transformSearchParams: {
      type: Function as PropType<(searchParams: Record<string, any>) => Record<string, any>>,
    },
    components: {
      type: Object as PropType<Components>,
    },
    rowSelection: {
      type: Object as PropType<RowSelectedProps>,
    },
  };
};

export type ListCheckLayoutProps = ExtractPropTypes<ReturnType<typeof getListCheckLayoutProps>>;

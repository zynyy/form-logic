import { ExtractPropTypes, PropType } from 'vue';
import { makeRequiredProp } from '@/utils/props';
import { Form } from '@formily/core';
import { ISchema } from '@formily/json-schema';
import {  Components,  StrNumBool } from '@/interface';
import { TableRowSelection } from 'ant-design-vue/lib/table/interface';
import { TableProps } from 'ant-design-vue';
import { TablePaginationConfig } from 'ant-design-vue/lib';
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'ant-design-vue/lib/table/interface';
import { getArrayBaseEvent } from '@/components/array-base';

export const getSchemeTableFormProps = () => {
  return {
    ...getArrayBaseEvent(),
    form: makeRequiredProp<PropType<Form>>(Object),
    schema: makeRequiredProp<PropType<ISchema>>(Object),
    language: {
      type: String as PropType<string>,
      default: 'zh-CN',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    components: {
      type: Object as PropType<Components>,
    },
    hasRowSelection: {
      type: [Boolean, Number, String] as PropType<StrNumBool>,
    },
    hasClearSelectedRows: {
      type: Boolean,
      default: true as const,
    },
    scrollY: {
      type: Number,
    },
    rowSelectionType: {
      type: String as PropType<TableRowSelection['type']>,
    },
    rowSelection: {
      type: Object as PropType<TableRowSelection>,
    },
    rowKey: {
      type: [Function, String] as PropType<TableProps['rowKey']>,
    },
    selectedRows: {
      type: Array,
    },
    dataSource: {
      type: Array,
    },
    currentPage: {
      type: Number,
    },
    total: {
      type: Number,
    },
    pageSize: {
      type: Number,
    },
    onChange: {
      type: Function as PropType<
        (
          pagination: TablePaginationConfig,
          filters: Record<string, FilterValue | null>,
          sorter: SorterResult<any> | SorterResult<any>[],
          extra: TableCurrentDataSource<any>,
        ) => void
      >,
    },
  };
};

export type SchemeTableFormProps = ExtractPropTypes<ReturnType<typeof getSchemeTableFormProps>>;

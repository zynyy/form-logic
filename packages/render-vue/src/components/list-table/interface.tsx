import { ExtractPropTypes, PropType } from 'vue';
import { getArrayBaseEvent, getRowSelectedProps } from '@/components/array-base/interface';

import { TableRowSelection } from 'ant-design-vue/lib/table/interface';

import { TableProps } from 'ant-design-vue';

export const getListTableProps = () => {
  return {
    ...getArrayBaseEvent(),
    ...getRowSelectedProps(),
    rowSelection: {
      type: Object as PropType<TableRowSelection>,
    },
    rowKey: {
      type: [Function, String] as PropType<TableProps['rowKey']>,
    },
    scrollY: {
      type: Number,
    },
    onTableChange: {
      type: Function as PropType<TableProps<any>['onChange']>,
    },
    pagination: {
      type: [Object, Boolean] as PropType<TableProps<any>['pagination']>,
    },
  };
};

export type ListTableProps = ExtractPropTypes<ReturnType<typeof getListTableProps>>;

import { ExtractPropTypes, PropType } from 'vue';
import { getArrayBaseEvent } from '@/components/array-base/interface';

import { TableRowSelection } from 'ant-design-vue/lib/table/interface';
import { StrNumBool } from '@/interface';
import { TableProps } from 'ant-design-vue';

// @ts-ignore
export const getArrayTableBaseProps = () => {
  return {
    ...getArrayBaseEvent(),
    rowSelectionType: {
      type: String as PropType<TableRowSelection['type']>,
    },
    rowSelection: {
      type: Object as PropType<TableRowSelection>,
    },
    rowKey: {
      type: [Function, String] as PropType<TableProps['rowKey']>,
    },
    customRow: {
      type: [Function] as PropType<TableProps['customRow']>,
    },

    hasPagination: {
      type: [Boolean, Number, String] as PropType<StrNumBool>,
    },
    hasRowSelection: {
      type: [Boolean, Number, String] as PropType<StrNumBool>,
    },
    scrollY: {
      type: Number,
    },
  };
};

export type ArrayTableBaseProps = ExtractPropTypes<ReturnType<typeof getArrayTableBaseProps>>;

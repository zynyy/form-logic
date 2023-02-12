import { ExtractPropTypes, PropType } from 'vue';
import { paginationProps } from 'ant-design-vue/es/pagination';

export const getArrayPaginationProps = () => {
  return {
    ...paginationProps(),
    dataSource: {
      type: Array as PropType<any[]>,
    },
  };
};

export type ArrayPaginationProps = ExtractPropTypes<ReturnType<typeof getArrayPaginationProps>>;

import { selectProps } from 'ant-design-vue/es/select';
import { ExtractPropTypes, PropType } from 'vue';
import { SelectProps } from 'ant-design-vue';

export const getPaginationStatusSelectProps = () => {
  return {
    onChange: {
      type: Function as PropType<SelectProps['onChange']>,
    },
    options: {
      type: Array as PropType<SelectProps['options']>,
    },
    pageSize: Number,
    value: Number,
  };
};

export type PaginationStatusSelectProps = ExtractPropTypes<
  ReturnType<typeof getPaginationStatusSelectProps>
>;

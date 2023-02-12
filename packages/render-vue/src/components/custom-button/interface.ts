import { ExtractPropTypes, PropType } from 'vue';
import { CustomButtonModeType } from '@/interface';

import { ButtonHTMLType, ButtonType } from 'ant-design-vue/es/button/buttonTypes';

export const getCustomButtonProps = () => {
  return {
    title: {
      type: String,
    },
    type: {
      type: String as PropType<ButtonType>,
    },
    htmlType: {
      type: String as PropType<ButtonHTMLType>,
    },
    loading: {
      type: Boolean,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    hasTooltip: {
      type: Boolean,
      default: undefined,
    },
    hasPopConfirm: {
      type: Boolean,
      default: undefined,
    },
    mode: {
      type: String as PropType<CustomButtonModeType>,
    },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
    },
  };
};

export type CustomButtonProps = ExtractPropTypes<ReturnType<typeof getCustomButtonProps>>;

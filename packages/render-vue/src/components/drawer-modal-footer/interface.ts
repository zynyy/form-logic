import { ExtractPropTypes, PropType } from 'vue';
import { ClickRecord, getButtonsProps } from '@/components/buttons';

export const getDrawerModalFooterProps = () => {
  return {
    ...getButtonsProps(),
    hasCloseButton: {
      type: Boolean,
      default: true as const,
    },
    hasConfirmButton: {
      type: Boolean,
      default: true as const,
    },
    hasButtons: {
      type: Boolean,
      default: true as const,
    },
    onConfirmClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    onCloseCLick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
  };
};

export type DrawerModalFooterProps = ExtractPropTypes<ReturnType<typeof getDrawerModalFooterProps>>;

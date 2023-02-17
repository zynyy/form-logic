import { modalProps } from 'ant-design-vue/lib/modal/Modal';
import { CSSProperties, ExtractPropTypes, PropType, VNode } from 'vue';
import { ModalFuncProps } from 'ant-design-vue';

export const getModalRenderProps = () => {
  return {
    hasDrag: {
      type: Boolean,
      default: true as const,
    },
  };
};

// @ts-ignore
export const getDraggableModalProps = () => {
  return {
    visible: {
      type: Boolean,
    },
    closable: {
      type: Boolean,
    },
    destroyOnClose: {
      type: Boolean,
    },
    confirmLoading: {
      type: Boolean,
      default: false as const,
    },
    maskClosable: {
      type: Boolean,
      default: true as const,
    },
    title: null,
    onOk: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    onCancel: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    width: {
      type: [Number, String],
    },
    bodyStyle: {
      type: Object as PropType<CSSProperties>,
    },
    afterClose: {
      type: Function as PropType<() => void>,
    }
  };
};

export interface InfoModalArgs extends ModalFuncProps {}

export interface ConfirmModalArgs extends ModalFuncProps {}

export type ModalRenderProps = ExtractPropTypes<ReturnType<typeof getModalRenderProps>>;

export type DraggableModalProps = ExtractPropTypes<ReturnType<typeof getDraggableModalProps>>;

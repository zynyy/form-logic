import { defineComponent } from 'vue';
import cls from 'classnames';

import { Modal } from 'ant-design-vue';
import { useStylePrefixCls } from '@/components/style/hooks';
import ModalRender from './ModalRender';
import { getDraggableModalProps } from './interface';

const DraggableModal = defineComponent({
  name: 'DraggableModal',
  inheritAttrs: false,
  props: getDraggableModalProps(),
  slots: ['title', 'footer'],
  setup(props, { slots }) {
    const prefixCls = useStylePrefixCls('draggable-modal');

    const modalRender = ({ originVNode }) => {
      return <ModalRender>{originVNode}</ModalRender>;
    };

    return () => {
      const { ...restProps } = props;

      return (
        <Modal
          {...restProps}
          class={cls(prefixCls)}
          closable={false}
          v-slots={{
            ...slots,
            modalRender,
          }}
        >
          {slots.default?.()}
        </Modal>
      );
    };
  },
});

export default DraggableModal;

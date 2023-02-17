import { Modal } from 'ant-design-vue';
import ModalRender from './ModalRender';
import { ConfirmModalArgs } from './interface';

const confirmModal = ({ ...props }: ConfirmModalArgs) => {
  const modalRender = ({ originVNode }) => {
    return <ModalRender hasDrag>{originVNode} </ModalRender>;
  };

  return Modal.confirm({
    ...props,
    modalRender,
  });
};

export default confirmModal;

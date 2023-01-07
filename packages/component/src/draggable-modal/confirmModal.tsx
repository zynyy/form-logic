import { Modal, ModalFuncProps } from 'antd';
import ModalRender from './ModalRender';

export interface ConfirmModalArgs extends ModalFuncProps {}

const confirmModal = ({ ...props }: ConfirmModalArgs) => {
  const modalRender = (modal) => {
    return <ModalRender modal={modal} hasDrag />;
  };

  return Modal.confirm({
    ...props,
    modalRender,
  });
};

export default confirmModal;

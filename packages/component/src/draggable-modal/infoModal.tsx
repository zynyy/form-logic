import { Modal, ModalFuncProps } from 'antd';
import ModalRender from './ModalRender';

export interface InfoModalArgs extends ModalFuncProps {}

const infoModal = ({ ...props }: InfoModalArgs) => {
  const modalRender = (modal) => {
    return <ModalRender modal={modal} hasDrag />;
  };

  return Modal.info({
    ...props,
    modalRender,
  });
};

export default infoModal;

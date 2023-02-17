import { Modal } from 'ant-design-vue';
import ModalRender from './ModalRender';
import { InfoModalArgs } from "./interface";



const infoModal = ({ ...props }: InfoModalArgs) => {
  const modalRender = ({ originVNode }) => {
    return <ModalRender>{originVNode} </ModalRender>;
  };

  return Modal.info({
    ...props,
    modalRender,
  });
};

export default infoModal;

import { Modal, ModalProps } from 'antd';
import { FC } from 'react';
import ModalRender from './ModalRender';

import { useDraggableModalStyle } from '@/draggable-modal/hooks';
import cls from 'classnames';

export interface DraggableModalProps extends ModalProps {
  hasDrag?: boolean;
}

const DraggableModal: FC<DraggableModalProps> = ({
  children,
  className,
  hasDrag,
  ...restProps
}) => {
  const [warpSSR, hashId, prefixCls] = useDraggableModalStyle();

  const modalRender = (modal) => {
    return <ModalRender modal={modal} hasDrag={hasDrag} />;
  };

  return warpSSR(
    <Modal
      {...restProps}
      className={cls(className, hashId, prefixCls)}
      closable={false}
      modalRender={modalRender}
    >
      {children}
    </Modal>,
  );
};

DraggableModal.defaultProps = {
  hasDrag: true,
};

export default DraggableModal;

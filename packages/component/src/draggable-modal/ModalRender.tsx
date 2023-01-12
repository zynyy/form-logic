import { FC, ReactNode, useRef, useState, useEffect } from 'react';

import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { useDraggableModalStyle } from '@/draggable-modal/hooks';
import cls from 'classnames';

import Portal from '@rc-component/portal';

import { DragOutlined } from '@ant-design/icons';
import { useDOMHover } from '@/hooks';

export interface ModalRenderProps {
  hasDrag?: boolean;
  modal: ReactNode;
  dragClassName?: string;
}

const ModalRender: FC<ModalRenderProps> = ({ hasDrag, dragClassName, modal }) => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggableRef = useRef<HTMLDivElement>(null);

  const [warpSSR, hashId, prefixCls] = useDraggableModalStyle();

  const [draggableDisabled, setDraggableDisabled] = useState(false);

  const [hover, domHoverRef] = useDOMHover();

  const [portalContainer, setPortalContainer] = useState(null);

  const handleStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggableRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  useEffect(() => {
    if (draggableRef.current) {
      setPortalContainer(draggableRef.current.querySelector(':scope .ant-modal-content'));
    }
  }, []);

  useEffect(() => {
    setDraggableDisabled(!hover);
  }, [hover]);

  return warpSSR(
    <Draggable disabled={draggableDisabled} bounds={bounds} onStart={handleStart}>
      <div ref={draggableRef}>
        {hasDrag ? (
          <Portal open getContainer={portalContainer}>
            <DragOutlined
              ref={domHoverRef}
              className={cls(hashId, dragClassName, `${prefixCls}-drag`)}
            />
          </Portal>
        ) : null}

        {modal}
      </div>
    </Draggable>,
  );
};

export default ModalRender;

import {
  CursorDragType,
  CursorStatus,
  LayoutObserver,
  Rect,
  TreeNode,
} from '@formlogic/designer-core';
import { Ref, onBeforeUnmount, ref } from 'vue';

import { useDesigner } from './useDesigner';
import { useEffect } from './useEffect';
import { useViewport } from './useViewport';

const isEqualRect = (rect1: Partial<DOMRect>, rect2: Rect) => {
  return (
    rect1?.x === rect2?.x &&
    rect1?.y === rect2?.y &&
    rect1?.width === rect2?.width &&
    rect1?.height === rect2?.height
  );
};

export const useValidNodeOffsetRect = (node: Ref<TreeNode>) => {
  const viewportRef = useViewport();

  const rectRef = ref(viewportRef.value?.getValidNodeOffsetRect(node.value));

  const engine = useDesigner();

  const layoutObserverRef = ref();

  const computeRect = () => {
    if (
      engine.value.cursor.status !== CursorStatus.Normal &&
      engine.value.cursor.dragType === CursorDragType.Move
    ) {
      return;
    }

    const nextRect = viewportRef.value.getValidNodeOffsetRect(node.value);

    // @ts-ignore
    if (!isEqualRect(rectRef.value, nextRect) && nextRect) {
      rectRef.value = nextRect;
    }
  };

  const nodeObserverEle = () => {
    disconnect();

    if (node.value?.id) {
      const element = viewportRef.value.findElementById(node.value?.id);
      layoutObserverRef.value = new LayoutObserver(computeRect);
      if (element) {
        layoutObserverRef.value.observe(element);
      } else {
        requestIdleCallback(nodeObserverEle);
      }
    }
  };

  const disconnect = () => {
    if (layoutObserverRef.value) {
      layoutObserverRef.value.disconnect();
    }
  };

  onBeforeUnmount(() => {
    disconnect();
  });

  useEffect(
    () => {
      nodeObserverEle();
      return () => {
        disconnect();
      };
    },
    () => node.value?.id,
  );

  return rectRef;
};

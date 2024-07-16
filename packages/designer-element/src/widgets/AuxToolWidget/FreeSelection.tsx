import { observer } from '@formlogic/render-vue2';
import {
  calcRectByStartEndPoint,
  CursorDragType,
  CursorStatus,
  isNum,
} from '@formlogic/designer-core';
import { CSSProperties } from '@vue/runtime-dom';
import { defineComponent } from 'vue';

import { useCursor, useOperation, usePrefix, useViewport } from '@/hooks';

export const FreeSelection = observer(
  defineComponent({
    name: 'DnFreeSelection',
    props: [],
    setup() {
      const operationRef = useOperation();
      const cursorRef = useCursor();
      const viewportRef = useViewport();
      const prefixRef = usePrefix('aux-free-selection');
      const createSelectionStyle = () => {
        const cursor = cursorRef.value;
        const viewport = viewportRef.value;

        const startDragPoint = viewportRef.value.getOffsetPoint({
          // @ts-ignore
          x: cursor.dragStartPosition.topClientX,
          // @ts-ignore
          y: cursor.dragStartPosition.topClientY,
        });
        const currentPoint = viewportRef.value.getOffsetPoint({
          // @ts-ignore
          x: cursor.position.topClientX,
          // @ts-ignore
          y: cursor.position.topClientY,
        });
        const rect = calcRectByStartEndPoint(
          startDragPoint,
          currentPoint,
          viewport.dragScrollXDelta,
          viewport.dragScrollYDelta,
        );
        const baseStyle: CSSProperties = {
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.2,
          borderWidth: 1,
          borderStyle: 'solid',
          transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
          height: isNum(rect.height) ? rect.height + 'px' : rect.height,
          width: isNum(rect.width) ? rect.width + 'px' : rect.width,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          zIndex: 1,
        };
        return baseStyle;
      };
      return () => {
        const cursor = cursorRef.value;

        if (
          operationRef.value.moveHelper.hasDragNodes ||
          cursor.status !== CursorStatus.Dragging ||
          cursor.dragType !== CursorDragType.Move
        ) {
          return null;
        }

        return <div class={prefixRef.value} style={createSelectionStyle()}></div>;
      };
    },
  }),
);

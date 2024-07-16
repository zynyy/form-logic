import './styles.less';

import { observer } from '@formlogic/render-vue2';
import { CursorStatus } from '@formlogic/designer-core';
import { autorun } from '@formily/reactive';
import { defineComponent, onBeforeUnmount, ref, unref } from 'vue';

import { useCursor, useDesigner, usePrefix } from '@/hooks';
import { composeExport } from '@/utils';
import { NodeTitleWidget } from '@/widgets';

const GhostWidgetComponent = defineComponent({
  name: 'DnGhostWidget',
  setup() {
    const designerRef = useDesigner();
    const cursorRef = useCursor();
    const refInstance = ref<HTMLDivElement>();
    const prefixRef = usePrefix('ghost');

    const dispose = autorun(() => {
      const cursor = unref(cursorRef);
      const transform = `perspective(1px) translate3d(${
        (cursor.position?.topClientX ?? 0) - 18
      }px,${(cursor.position?.topClientY ?? 0) - 12}px,0) scale(0.8)`;
      if (!refInstance.value) return;
      refInstance.value.style.transform = transform;
    });

    onBeforeUnmount(() => {
      dispose && dispose();
    });

    return () => {
      const designer = unref(designerRef);
      const cursor = unref(cursorRef);

      const draggingNodes = designer.findMovingNodes();
      const firstNode = draggingNodes[0];

      const renderNodes = () => {
        return (
          <span
            style={{
              whiteSpace: 'nowrap',
            }}
          >
            <NodeTitleWidget props={{ node: firstNode }} />
            {draggingNodes.length > 1 ? '...' : ''}
          </span>
        );
      };
      if (!firstNode) return null;
      return cursor.status === CursorStatus.Dragging ? (
        <div class={prefixRef.value} ref={refInstance}>
          {renderNodes()}
        </div>
      ) : null;
    };
  },
});

export const GhostWidget = composeExport(observer(GhostWidgetComponent), {
  displayName: 'GhostWidget',
});

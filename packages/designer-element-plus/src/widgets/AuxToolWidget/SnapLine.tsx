import { Fragment, observer } from '@formlogic/render-vue2';
import { CursorStatus, SnapLine as SnapLineCore } from '@formlogic/designer-core';
import { defineComponent } from 'vue';

import { useCursor, usePrefix, useTransformHelper } from '@/hooks';

export const SnapLine = observer(
  defineComponent({
    name: 'DnSnapLine',
    setup() {
      const cursor = useCursor();
      const transformHelper = useTransformHelper();
      const prefix = usePrefix('aux-snap-line');
      const createLineStyle = (rect: DOMRect) => {
        return {
          top: 0,
          left: 0,
          height: rect.height || 1,
          width: rect.width || 1,
          transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
          background: `#b0b1f3`,
          position: 'absolute',
          zIndex: 2,
        };
      };

      return () => {
        if (cursor.value.status !== CursorStatus.Dragging) {
          return null;
        }

        return (
          <Fragment>
            {transformHelper.closestSnapLines.map((line: SnapLineCore, key: number) => {
              if (line.type !== 'normal') return null;
              //@ts-ignore
              return <div key={key} class={prefix} style={createLineStyle(line.rect)} />;
            })}
          </Fragment>
        );
      };
    },
  }),
);

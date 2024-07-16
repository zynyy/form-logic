import { Fragment, observer } from '@formlogic/render-vue2';
import { ClosestPosition, CursorStatus, TreeNode, isNum } from '@formlogic/designer-core';
import cls from 'classnames';
import { defineComponent, toRef } from 'vue';

import { useCursor, useMoveHelper, usePrefix, useValidNodeOffsetRect, useViewport } from '@/hooks';
import { composeExport } from '@/utils';

const CoverRect = defineComponent({
  name: 'DnCoverRect',
  props: ['dragging', 'dropping', 'node'],
  setup(props) {
    const prefixRef = usePrefix('aux-cover-rect');

    const node = toRef(props, 'node');

    const rectRef = useValidNodeOffsetRect(node);

    return () => {
      const rect = rectRef.value;
      const createCoverStyle = () => {
        const baseStyle: any = {
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        };
        if (rect) {
          baseStyle.transform = `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`;
          baseStyle.height = isNum(rect.height) ? rect.height + 'px' : rect.height;
          baseStyle.width = isNum(rect.width) ? rect.width + 'px' : rect.width;
        }
        return baseStyle;
      };
      return (
        <div
          class={cls(prefixRef.value, {
            dragging: props.dragging,
            dropping: props.dropping,
          })}
          style={createCoverStyle()}
        ></div>
      );
    };
  },
});

const CoverComponent = observer(
  defineComponent({
    setup() {
      const moveHelperRef = useMoveHelper();
      const viewportRef = useViewport();
      const cursorRef = useCursor();
      const renderDropCover = () => {
        if (
          !moveHelperRef.value.closestNode ||
          !moveHelperRef.value.closestNode?.allowAppend(moveHelperRef.value.dragNodes) ||
          moveHelperRef.value.closestDirection !== ClosestPosition.Inner
        ) {
          return null;
        }
        return (
          <CoverRect
            //@ts-ignore
            attrs={{
              dropping: true,
              node: moveHelperRef.value.closestNode,
            }}
          />
        );
      };
      return () => {
        if (cursorRef.value.status !== CursorStatus.Dragging) return null;
        return (
          <Fragment>
            {moveHelperRef.value.dragNodes.map((node: TreeNode) => {
              if (!node) return;
              if (!viewportRef.value.findElementById(node.id)) return;
              // @ts-ignore
              return <CoverRect key={node.id} attrs={{ dragging: true, node: node }} />;
            })}
            {renderDropCover()}
          </Fragment>
        );
      };
    },
  }),
);

export const Cover = composeExport(CoverComponent, { displayName: 'Cover' });

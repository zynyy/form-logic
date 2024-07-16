import { observer } from '@formlogic/render-vue2';
import { ClosestPosition, isNum } from '@formlogic/designer-core';
import { defineComponent, toRef } from 'vue';

import { useMoveHelper, usePrefix } from '@/hooks';
import { composeExport } from '@/utils';

export interface IInsertionProps {
  workspaceId?: string;
}

const InsertionComponent = defineComponent({
  name: 'DnInsertion',
  props: ['workspaceId'],
  setup(props) {
    const workspaceId = toRef(props, 'workspaceId');

    const moveHelperRef = useMoveHelper(workspaceId);
    const prefixRef = usePrefix('outline-tree-insertion');
    return () => {
      const moveHelper = moveHelperRef.value;
      const prefix = prefixRef.value;
      const createInsertionStyle = () => {
        const closestDirection = moveHelper.viewportClosestDirection;
        const closestRect = moveHelper.viewportClosestOffsetRect;
        const baseStyle: Record<string, any> = {
          position: 'absolute',
          transform: 'perspective(1px) translate3d(0,0,0)',
          top: 0,
          left: 0,
        };
        if (!closestRect) return baseStyle;
        if (
          closestDirection === ClosestPosition.After ||
          closestDirection === ClosestPosition.InnerAfter ||
          closestDirection === ClosestPosition.Under ||
          closestDirection === ClosestPosition.ForbidAfter ||
          closestDirection === ClosestPosition.ForbidInnerAfter ||
          closestDirection === ClosestPosition.ForbidUnder
        ) {
          baseStyle.width = closestRect.width;
          baseStyle.height = 2;
          baseStyle.transform = `perspective(1px) translate3d(${closestRect.x}px,${
            closestRect.y + closestRect.height - 2
          }px,0)`;
        } else if (
          closestDirection === ClosestPosition.Before ||
          closestDirection === ClosestPosition.InnerBefore ||
          closestDirection === ClosestPosition.Upper ||
          closestDirection === ClosestPosition.ForbidBefore ||
          closestDirection === ClosestPosition.ForbidInnerBefore ||
          closestDirection === ClosestPosition.ForbidUpper
        ) {
          baseStyle.width = closestRect.width;
          baseStyle.height = 2;
          baseStyle.transform = `perspective(1px) translate3d(${closestRect.x}px,${closestRect.y}px,0)`;
        }
        // @ts-ignore
        if (closestDirection.includes('FORBID')) {
          baseStyle.backgroundColor = 'red';
        } else {
          baseStyle.backgroundColor = '';
        }
        Object.keys(baseStyle).forEach((key) => {
          const value = baseStyle[key];
          isNum(value) && (baseStyle[key] = value + 'px');
        });
        return baseStyle;
      };
      if (!moveHelper?.closestNode) return null;

      return <div class={prefix} style={createInsertionStyle()}></div>;
    };
  },
});

export const Insertion = composeExport(observer(InsertionComponent), {
  displayName: 'Insertion',
});

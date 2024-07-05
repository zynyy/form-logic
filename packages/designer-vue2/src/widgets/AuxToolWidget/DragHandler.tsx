import { observer } from '@formlogic/code-render';
import type { TreeNode } from '@formlogic/designer-core';
import { Button } from 'element-ui';
import { defineComponent } from 'vue';

import { useDesigner, usePrefix, useStyle } from '@/hooks';
import { composeExport } from '@/utils';
import { IconWidget } from '@/widgets';

export interface IDragHandlerProps {
  node: TreeNode;
}

const DragHandlerComponent = observer(
  defineComponent({
    name: 'DnDragHandler',
    props: ['node'],
    setup(props) {
      const designerRef = useDesigner();
      const style = useStyle();
      const prefixRef = usePrefix('aux-drag-handler');

      return () => {
        const node = props.node;
        if (node === node.root || !node.allowDrag()) return null;
        const handlerProps = {
          [designerRef.value.props.nodeDragHandlerAttrName!]: 'true',
        };
        return (
          <Button attrs={handlerProps} type="primary" class={prefixRef.value} style={style}>
            <IconWidget infer="Move" />
          </Button>
        );
      };
    },
  }),
);

export const DragHandler = composeExport(DragHandlerComponent, {
  displayName: 'DragHandler',
});

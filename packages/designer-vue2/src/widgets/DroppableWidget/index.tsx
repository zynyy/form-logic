import './styles.less';

import { observer } from '@formlogic/code-render';
import { TreeNode } from '@formlogic/designer-core';
import { CSSProperties } from '@vue/runtime-dom';
import { defineComponent } from 'vue';

import { useNodeIdProps, usePrefix, useTreeNode } from '@/hooks';
import { NodeActionsWidget, NodeTitleWidget } from '@/widgets';

export interface IDroppableWidgetProps {
  node?: TreeNode;
  actions?: Record<string, any>[];
  height?: number;
  style?: CSSProperties;
  className?: string;
}

export const DroppableWidget = observer(
  defineComponent({
    name: 'DnDroppableWidget',
    props: ['node', 'actions', 'height'],
    setup(props, { slots }) {
      const currentNodeRef = useTreeNode();
      const nodeIdRef = useNodeIdProps(props.node);
      const prefix = usePrefix('droppable-widget');
      return () => {
        const target = props.node ?? currentNodeRef.value;
        const hasChildren = target.children?.length > 0;

        return (
          <div
            class={prefix.value}
            {...{
              attrs: nodeIdRef.value,
            }}
          >
            {hasChildren ? (
              slots.default?.()
            ) : (
              <div style={{ height: props.height + 'px' }} class="dn-droppable-placeholder">
                <NodeTitleWidget node={target} title={target.getMessage('placeholder')} />
              </div>
            )}
            {props.actions?.length ? (
              <NodeActionsWidget>
                {props.actions.map((action: any, key: number) => (
                  <NodeActionsWidget.Action props={{ ...action }} key={key} />
                ))}
              </NodeActionsWidget>
            ) : null}
          </div>
        );
      };
    },
  }),
);

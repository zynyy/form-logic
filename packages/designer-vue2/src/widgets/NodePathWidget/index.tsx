import './styles.less';

import { Fragment } from '@formlogic/code-render';
import { Breadcrumb, BreadcrumbItem } from 'element-ui';
import { isEmpty } from 'lodash';
import { defineComponent, toRef } from 'vue';

import { useCurrentNode, useHover, usePrefix, useSelection } from '@/hooks';
import { IconWidget, NodeTitleWidget } from '@/widgets';

export interface INodePathWidgetProps {
  workspaceId?: string;
  maxItems?: number;
}

export const NodePathWidget = defineComponent({
  name: 'DnNodePath',
  props: ['workspaceId', 'maxItems'],
  setup(props) {
    const workspaceId = toRef(props, 'workspaceId');

    const selectedRef = useCurrentNode(workspaceId);
    const selectionRef = useSelection(workspaceId);
    const hoverRef = useHover(workspaceId);
    const prefixRef = usePrefix('node-path');

    return () => {
      if (!selectedRef.value) return <Fragment />;
      const maxItems = props.maxItems ?? 3;
      const nodes = selectedRef.value
        .getParents()
        .slice(0, maxItems - 1)
        .reverse()
        .concat(selectedRef.value);
      return (
        <Breadcrumb class={prefixRef.value}>
          {nodes.map((node, key) => {
            const hasEmpty = isEmpty(node.designerProps?.propsSchema);

            return (
              <BreadcrumbItem key={key}>
                {key === 0 && <IconWidget infer="Position" style={{ marginRight: '3px' }} />}

                {hasEmpty ? (
                  <span
                    //@ts-ignore
                    vOn:mouseenter={() => {
                      hoverRef.value.setHover(node);
                    }}
                  >
                    <NodeTitleWidget props={{ node: node }} />
                  </span>
                ) : (
                  <a
                    href=""
                    //@ts-ignore
                    vOn:mouseenter={() => {
                      hoverRef.value.setHover(node);
                    }}
                    vOn:click_prevent_stop={() => {
                      selectionRef.value.select(node);
                    }}
                  >
                    <NodeTitleWidget props={{ node: node }} />
                  </a>
                )}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      );
    };
  },
});

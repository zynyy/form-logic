import { observer } from '@formlogic/render-vue2';
import { TreeNode } from '@formlogic/designer-core';
import { CSSProperties } from '@vue/runtime-dom';
import { Button } from 'element-ui';
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, unref } from 'vue';

import { useHover, usePrefix, useSelection } from '@/hooks';
import { composeExport } from '@/utils';
import { IconWidget, NodeTitleWidget } from '@/widgets';

const useMouseHover = <T extends { value?: HTMLElement }>(
  refInstance: T,
  enter?: () => void,
  leave?: () => void,
) => {
  const unmounted = ref(false);
  let timer: number | null = null;

  const onMouseOver = (e: MouseEvent) => {
    const target: HTMLElement = e.target as any;
    // @ts-ignore
    clearTimeout(timer);
    // @ts-ignore
    timer = setTimeout(() => {
      if (unmounted.value) return;
      // @ts-ignore
      const result = unref(refInstance) as any;
      if (result?.contains(target)) {
        enter && enter();
      } else {
        leave && leave();
      }
    }, 100);
  };

  onMounted(() => {
    document.addEventListener('mouseover', onMouseOver);
  });

  onBeforeUnmount(() => {
    unmounted.value = true;
    document.removeEventListener('mouseover', onMouseOver);
  });
};

export interface ISelectorProps {
  node: TreeNode;
  style?: CSSProperties;
}

const SelectorComponent = observer(
  defineComponent({
    name: 'DnSelector',
    props: { node: { type: Object as PropType<TreeNode> } },
    setup(props) {
      const expand = ref(false);

      const setExpand = (value: boolean) => {
        expand.value = value;
      };

      const hoverRef = useHover();
      const refInstance = ref<HTMLDivElement>();
      const selectionRef = useSelection();
      const prefixRef = usePrefix('aux-selector');

      useMouseHover(
        refInstance,
        () => {
          setExpand(true);
        },
        () => {
          setExpand(false);
        },
      );

      return () => {
        const node = props.node;
        const renderIcon = (node?: TreeNode) => {
          if (!node) {
            return null;
          }

          const icon = node.designerProps.icon;
          if (icon) {
            return <IconWidget infer={icon} />;
          }
          if (node === node.root) {
            return <IconWidget infer="Page" />;
          } else if (node.designerProps?.droppable) {
            return <IconWidget infer="Container" />;
          }
          return <IconWidget infer="Component" />;
        };

        const parents = node?.getParents() || [];

        const renderMenu = () => {
          return (
            <div
              class={prefixRef.value + '-menu'}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
              }}
            >
              {parents.slice(0, 4).map((parent: any) => {
                return (
                  <Button
                    key={parent.id}
                    type="primary"
                    vOn:click_prevent_stop={() => {
                      selectionRef.value.select(parent.id);
                    }}
                    vOn:mouseenter_native={() => {
                      hoverRef.value.setHover(parent);
                    }}
                  >
                    {renderIcon(parent)}
                    <span style={{ transform: 'scale(0.85)', marginLeft: '2px' }}>
                      <NodeTitleWidget node={parent} />
                    </span>
                  </Button>
                );
              })}
            </div>
          );
        };

        return (
          <div ref={refInstance} class={prefixRef.value}>
            <Button
              class={prefixRef.value + '-title'}
              type="primary"
              vOn:mouseenter_native={() => {
                hoverRef.value.setHover(node);
              }}
            >
              {renderIcon(node)}
              <span>
                <NodeTitleWidget node={node} />
              </span>
            </Button>
            {expand.value && renderMenu()}
          </div>
        );
      };
    },
  }),
);

export const Selector = composeExport(SelectorComponent, {
  displayName: 'Selector',
});

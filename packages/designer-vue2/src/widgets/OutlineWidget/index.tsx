import { observer } from '@formlogic/code-render';
import { Viewport } from '@formlogic/designer-core';
import cls from 'classnames';
import { defineComponent, onMounted, provide, ref, unref } from 'vue';

import { useOutline, usePrefix, useStyle, useTree, useWorkbench } from '@/hooks';

import { NodeSymbol } from './context';
import { Insertion } from './Insertion';
import { OutlineTreeNode } from './OutlineNode';

export const OutlineTreeWidget = observer(
  defineComponent({
    name: 'DnOutlineTree',
    props: ['renderActions', 'renderTitle', 'onClose'],
    setup(props) {
      const refInstance = ref<HTMLDivElement>();
      const prefixRef = usePrefix('outline-tree');
      const workbenchRef = useWorkbench();
      const current = workbenchRef.value?.activeWorkspace || workbenchRef.value?.currentWorkspace;
      const workspaceId = ref(current?.id);
      const treeRef = useTree(workspaceId);
      const outline = useOutline(workspaceId);
      const outlineRef = ref<Viewport>();
      const style = useStyle();

      provide(
        NodeSymbol,
        ref({
          renderActions: props.renderActions,
          renderTitle: props.renderTitle,
        }),
      );

      // [workspaceId, outline]
      // TODO::响应式有bug
      onMounted(() => {
        const _outline = outline.value;
        if (!workspaceId.value) return;
        if (outlineRef.value && outlineRef.value !== _outline) {
          outlineRef.value.onUnmount();
        }
        if (refInstance.value && outline) {
          _outline.onMount(refInstance.value, window);
        }
        outlineRef.value = _outline;
        return () => {
          _outline.onUnmount();
        };
      });

      return () => {
        const prefix = unref(prefixRef);
        const tree = unref(treeRef);
        if (!outline.value || !workspaceId.value) return null;
        return (
          <div class={cls(prefix + '-container')} style={style}>
            <div class={prefix + '-content'} ref={refInstance}>
              <OutlineTreeNode node={tree} workspaceId={workspaceId.value} />
              <div
                class={prefix + '-aux'}
                style={{
                  pointerEvents: 'none',
                }}
              >
                <Insertion workspaceId={workspaceId.value} />
              </div>
            </div>
          </div>
        );
      };
    },
  }),
);

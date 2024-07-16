import './styles.less';

import { observer } from '@formlogic/render-vue2';
import {
  ClosestPosition,
  CursorStatus,
  DragMoveEvent,
  TreeNode,
  isFn,
} from '@formlogic/designer-core';
import { autorun } from '@formily/reactive';
import cls from 'classnames';
import { defineComponent, onBeforeUnmount, onMounted, ref, toRef } from 'vue';

import { useContext } from '@/context';
import { useCursor, useDesigner, useMoveHelper, usePrefix, useSelection, useStyle } from '@/hooks';
import { IconWidget, NodeTitleWidget } from '@/widgets';

import { NodeSymbol } from './context';

export const OutlineTreeNode = observer(
  defineComponent({
    name: 'DnOutlineTreeNode',
    props: ['workspaceId', 'node'],
    setup(props) {
      const style = useStyle();

      const prefix = usePrefix('outline-tree-node');
      const engine = useDesigner();
      const refInstance = ref<HTMLDivElement>();
      const ctx = useContext(NodeSymbol);
      const request = ref();
      const cursor = useCursor();
      const workspaceId = toRef(props, 'workspaceId');

      const selection = useSelection(workspaceId);
      const moveHelper = useMoveHelper(workspaceId);

      const unSub: any[] = [];
      onMounted(() => {
        const subCb = engine.value.subscribeTo(DragMoveEvent, () => {
          const closestNodeId = moveHelper.value?.closestNode?.id;
          const closestDirection = moveHelper.value?.outlineClosestDirection;
          const id = props.node.id;
          if (!refInstance.value) return;
          if (closestNodeId === id && closestDirection === ClosestPosition.Inner) {
            if (!refInstance.value.classList.contains('droppable')) {
              refInstance.value.classList.add('droppable');
            }
            if (!refInstance.value.classList.contains('expanded')) {
              if (request.value) {
                clearTimeout(request.value);
                request.value = null;
              }
              request.value = setTimeout(() => {
                if (refInstance.value) {
                  refInstance.value.classList.add('expanded');
                }
              }, 600);
            }
          } else {
            if (request.value) {
              clearTimeout(request.value);
              request.value = null;
            }
            if (refInstance.value.classList.contains('droppable')) {
              refInstance.value.classList.remove('droppable');
            }
          }
        });
        unSub.push(subCb);
        // [node, selection]
        const subCb2 = autorun(() => {
          const selectedIds = selection.value?.selected || [];
          const id = props.node.id;
          if (!refInstance.value) return;
          if (selectedIds.includes(id)) {
            if (!refInstance.value.classList.contains('selected')) {
              refInstance.value.classList.add('selected');
            }
          } else {
            if (refInstance.value.classList.contains('selected')) {
              refInstance.value.classList.remove('selected');
            }
          }
          if (cursor.value.status === CursorStatus.Dragging) {
            if (refInstance.value.classList.contains('selected')) {
              refInstance.value.classList.remove('selected');
            }
          }
        });
        unSub.push(subCb2);
      });

      onBeforeUnmount(() => {
        unSub.forEach((cb) => cb());
      });

      return () => {
        const node = props.node;

        if (!node) return null;
        const renderIcon = (node: TreeNode) => {
          const icon = node.designerProps.icon;
          if (icon) {
            return <IconWidget infer={icon} size={'12px'} />;
          }
          if (node === node?.root) {
            return <IconWidget infer="Page" size={'12px'} />;
          } else if (node.designerProps?.droppable) {
            return <IconWidget infer="Container" size={'12px'} />;
          }
          return <IconWidget infer="Component" size={'12px'} />;
        };

        const renderTitle = (node: TreeNode) => {
          if (isFn(ctx.value.renderTitle)) return ctx.value.renderTitle(node);

          const { code } = node.props || {};

          const text = code ? ` - ${code}` : null;

          return (
            <span>
              <NodeTitleWidget node={node} />
              {text}
            </span>
          );
        };
        const renderActions = (node: TreeNode) => {
          if (isFn(ctx.value.renderActions)) return ctx.value.renderActions(node);
        };

        const { hidden, required } = node.props || {};

        return (
          <div
            style={style}
            ref={refInstance}
            class={[prefix.value, 'expanded']}
            data-designer-outline-node-id={node.id}
          >
            <div class={prefix.value + '-header'}>
              <div
                class={prefix.value + '-header-head'}
                style={{
                  left: -node.depth * 16 + 'px',
                  width: node.depth * 16 + 'px',
                }}
              ></div>
              <div class={prefix.value + '-header-content'}>
                <div class={prefix.value + '-header-base'}>
                  {(node?.children?.length > 0 || node === node.root) && (
                    <div
                      class={prefix.value + '-expand'}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (refInstance.value?.classList?.contains('expanded')) {
                          refInstance.value?.classList.remove('expanded');
                        } else {
                          refInstance.value?.classList.add('expanded');
                        }
                      }}
                    >
                      <IconWidget infer="Expand" size={10} />
                    </div>
                  )}
                  <div class={prefix.value + '-icon'}>{renderIcon(node)}</div>
                  <div
                    class={cls(`${prefix.value}-title`, {
                      required,
                    })}
                  >
                    {renderTitle(node)}
                  </div>
                </div>
                <div class={prefix.value + '-header-actions'} data-click-stop-propagation={true}>
                  {renderActions(node)}
                  {hidden ? <IconWidget infer="EyeClose" size={14} /> : null}
                </div>
              </div>
            </div>
            <div class={prefix.value + '-children'}>
              {node.children?.map((child: TreeNode) => {
                return (
                  <OutlineTreeNode key={child.id} node={child} workspaceId={props.workspaceId} />
                );
              })}
            </div>
          </div>
        );
      };
    },
  }),
);

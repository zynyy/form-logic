import { DragMoveEvent, DragStartEvent, DragStopEvent } from '@/events';
import { CursorDragType, Engine } from '@/models';

export const useTranslateEffect = (engine: Engine) => {
  engine.subscribeTo(DragStartEvent, (event, context) => {
    const target = event.data.target as HTMLElement;
    const currentWorkspace = context?.workspace ?? engine.workbench.activeWorkspace;
    const handler = target?.closest(`*[${engine.props.nodeTranslateAttrName}]`);
    if (!currentWorkspace) return;
    const helper = currentWorkspace.operation.transformHelper;
    if (handler) {
      const type = handler.getAttribute(engine.props.nodeTranslateAttrName);
      if (type) {
        const selectionElement = handler.closest(
          `*[${engine.props.nodeSelectionIdAttrName}]`,
        ) as HTMLElement;
        if (selectionElement) {
          const nodeId = selectionElement.getAttribute(engine.props.nodeSelectionIdAttrName);
          if (nodeId) {
            const node = engine.findNodeById(nodeId);
            if (node) {
              helper.dragStart({ dragNodes: [node], type: 'translate' });
            }
          }
        }
      }
    }
  });
  engine.subscribeTo(DragMoveEvent, (event, context) => {
    if (engine.cursor.dragType !== CursorDragType.Translate) return;
    const currentWorkspace = context?.workspace ?? engine.workbench.activeWorkspace;
    const helper = currentWorkspace?.operation.transformHelper;
    const dragNodes = helper.dragNodes;
    if (!dragNodes.length) return;
    helper.dragMove();
    dragNodes.forEach((node) => {
      const element = node.getElement();
      if (element) {
        helper.translate(node, (translate) => {
          if (node.designerProps.translatable?.callback) {
            node.designerProps.translatable.callback(node, element, translate);
          } else {
            const translateX = node.designerProps.translatable?.x
              ? translate.x
              : element.clientLeft;
            const translateY = node.designerProps.translatable?.y ? translate.y : element.clientTop;

            element.style.position = 'absolute';
            element.style.left = '0px';
            element.style.top = '0px';
            element.style.transform = `translate3d(${translateX}px,${translateY}px,0)`;
          }
        });
      }
    });
  });
  engine.subscribeTo(DragStopEvent, (event, context) => {
    if (engine.cursor.dragType !== CursorDragType.Translate) return;
    const currentWorkspace = context?.workspace ?? engine.workbench.activeWorkspace;
    const helper = currentWorkspace?.operation.transformHelper;
    if (helper) {
      helper.dragEnd();
    }
  });
};

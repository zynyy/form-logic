import { DragMoveEvent, DragStartEvent, DragStopEvent } from '@/events';
import { CursorDragType, Engine } from '@/models';

export const useResizeEffect = (engine: Engine) => {
  const findStartNodeHandler = (target: HTMLElement) => {
    const handler = target?.closest(`*[${engine.props.nodeResizeHandlerAttrName}]`);
    if (handler) {
      const direction = handler.getAttribute(engine.props.nodeResizeHandlerAttrName);
      if (direction) {
        const element = handler.closest(`*[${engine.props.nodeSelectionIdAttrName}]`);
        if (element) {
          const nodeId = element.getAttribute(engine.props.nodeSelectionIdAttrName);
          if (nodeId) {
            const node = engine.findNodeById(nodeId);
            if (node) {
              return { direction, node, element };
            }
          }
        }
      }
    }
    return;
  };

  engine.subscribeTo(DragStartEvent, (event, context) => {
    const target = event.data.target as HTMLElement;
    const currentWorkspace = context?.workspace ?? engine.workbench.activeWorkspace;
    if (!currentWorkspace) return;
    const handler = findStartNodeHandler(target);
    const helper = currentWorkspace.operation.transformHelper;
    if (handler) {
      const selectionElement = handler.element.closest(
        `*[${engine.props.nodeSelectionIdAttrName}]`,
      ) as HTMLElement;
      if (selectionElement) {
        const nodeId = selectionElement.getAttribute(engine.props.nodeSelectionIdAttrName);
        if (nodeId) {
          const node = engine.findNodeById(nodeId);
          if (node) {
            helper.dragStart({
              dragNodes: [node],
              type: 'resize',
              direction: handler.direction,
            });
          }
        }
      }
    }
  });

  engine.subscribeTo(DragMoveEvent, (event, context) => {
    if (engine.cursor.dragType !== CursorDragType.Resize) return;
    const currentWorkspace = context?.workspace ?? engine.workbench.activeWorkspace;
    const helper = currentWorkspace?.operation.transformHelper;
    const dragNodes = helper.dragNodes;
    if (!dragNodes.length) return;
    helper.dragMove();
    dragNodes.forEach((node) => {
      const element = node.getElement();
      if (element) {
        helper.resize(node, (rect) => {
          if (node.designerProps.resizable?.callback) {
            node.designerProps.resizable.callback(node, element, rect);
          } else {
            element.style.width = rect.width + 'px';
            element.style.height = rect.height + 'px';
            element.style.position = 'absolute';
            element.style.left = '0px';
            element.style.top = '0px';
            element.style.transform = `translate3d(${rect.x}px,${rect.y}px,0)`;
          }
        });
      }
    });
  });

  engine.subscribeTo(DragStopEvent, (event, context) => {
    if (engine.cursor.dragType !== CursorDragType.Resize) return;
    const currentWorkspace = context?.workspace ?? engine.workbench.activeWorkspace;
    const helper = currentWorkspace?.operation.transformHelper;
    if (helper) {
      helper.dragEnd();
    }
  });
};

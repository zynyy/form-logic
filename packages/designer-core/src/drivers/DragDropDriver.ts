import { DragMoveEvent, DragStartEvent, DragStopEvent } from '@/events/cursor';
import { EventDriver } from '@/utils';

const GlobalState: {
  dragging: boolean;
  onMouseDownAt: number;
  startEvent: MouseEvent | null;
  moveEvent: MouseEvent | DragEvent | null;
} = {
  dragging: false,
  onMouseDownAt: 0,
  startEvent: null,
  moveEvent: null,
};

export class DragDropDriver extends EventDriver {
  onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey) {
      return;
    }

    const target: any = e.target;

    if (!target) {
      return;
    }

    if (target['isContentEditable'] || target['contentEditable'] === 'true') {
      return true;
    }
    if (target?.['closest']?.('.monaco-editor')) {
      return;
    }
    GlobalState.startEvent = e;
    GlobalState.dragging = false;
    GlobalState.onMouseDownAt = Date.now();
    this.batchAddEventListener('mouseup', this.onMouseUp);
    this.batchAddEventListener('dragend', this.onMouseUp);
    this.batchAddEventListener('dragstart', this.onStartDrag);
    this.batchAddEventListener('mousemove', this.onDistanceChange);
  };

  onMouseUp = (e: MouseEvent) => {
    if (GlobalState.dragging) {
      this.dispatch(
        new DragStopEvent({
          clientX: e.clientX,
          clientY: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
          target: e.target,
          view: e.view,
        }),
      );
    }
    this.batchRemoveEventListener('contextmenu', this.onContextMenuWhileDragging, true);
    this.batchRemoveEventListener('mouseup', this.onMouseUp);
    this.batchRemoveEventListener('mousedown', this.onMouseDown);
    this.batchRemoveEventListener('dragover', this.onMouseMove);
    this.batchRemoveEventListener('mousemove', this.onMouseMove);
    this.batchRemoveEventListener('mousemove', this.onDistanceChange);
    GlobalState.dragging = false;
  };

  onMouseMove = (e: MouseEvent | DragEvent) => {
    if (
      !e ||
      (e.clientX === GlobalState.moveEvent?.clientX && e.clientY === GlobalState.moveEvent?.clientY)
    ) {
      return;
    }

    this.dispatch(
      new DragMoveEvent({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        target: e.target,
        view: e.view,
      }),
    );
    GlobalState.moveEvent = e;
  };

  onContextMenuWhileDragging = (e: MouseEvent) => {
    e.preventDefault();
  };

  onStartDrag = (e: MouseEvent | DragEvent) => {
    if (GlobalState.dragging) return;
    GlobalState.startEvent = GlobalState.startEvent || e;
    this.batchAddEventListener('dragover', this.onMouseMove);
    this.batchAddEventListener('mousemove', this.onMouseMove);
    this.batchAddEventListener('contextmenu', this.onContextMenuWhileDragging, true);
    this.dispatch(
      new DragStartEvent({
        clientX: GlobalState.startEvent.clientX,
        clientY: GlobalState.startEvent.clientY,
        pageX: GlobalState.startEvent.pageX,
        pageY: GlobalState.startEvent.pageY,
        target: GlobalState.startEvent.target,
        view: GlobalState.startEvent.view,
      }),
    );
    GlobalState.dragging = true;
  };

  onDistanceChange = (e: MouseEvent) => {
    const distance = Math.sqrt(
      // @ts-ignore
      Math.pow(e.pageX - GlobalState.startEvent.pageX, 2) +
        // @ts-ignore
        Math.pow(e.pageY - GlobalState.startEvent.pageY, 2),
    );
    const timeDelta = Date.now() - GlobalState.onMouseDownAt;
    if (timeDelta > 10 && e !== GlobalState.startEvent && distance > 4) {
      this.batchRemoveEventListener('mousemove', this.onDistanceChange);
      this.onStartDrag(e);
    }
  };

  attach() {
    this.batchAddEventListener('mousedown', this.onMouseDown, true);
  }

  detach() {
    GlobalState.dragging = false;
    GlobalState.moveEvent = null;
    GlobalState.onMouseDownAt = 0;
    GlobalState.startEvent = null;
    this.batchRemoveEventListener('mousedown', this.onMouseDown, true);
    this.batchRemoveEventListener('dragstart', this.onStartDrag);
    this.batchRemoveEventListener('dragend', this.onMouseUp);
    this.batchRemoveEventListener('dragover', this.onMouseMove);
    this.batchRemoveEventListener('mouseup', this.onMouseUp);
    this.batchRemoveEventListener('mousemove', this.onMouseMove);
    this.batchRemoveEventListener('mousemove', this.onDistanceChange);
    this.batchRemoveEventListener('contextmenu', this.onContextMenuWhileDragging, true);
  }
}

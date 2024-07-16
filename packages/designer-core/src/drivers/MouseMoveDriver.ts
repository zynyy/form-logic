import { MouseMoveEvent } from '@/events/cursor';
import { Engine } from '@/models/Engine';
import { EventDriver } from '@/utils';
export class MouseMoveDriver extends EventDriver<Engine> {
  request: number | null = null;

  onMouseMove = (e: MouseEvent) => {
    this.request = requestAnimationFrame(() => {
      if (typeof this.request === 'number') {
        cancelAnimationFrame(this.request);
      }
      this.dispatch(
        new MouseMoveEvent({
          clientX: e.clientX,
          clientY: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
          target: e.target,
          view: e.view,
        }),
      );
    });
  };

  attach() {
    this.addEventListener('mousemove', this.onMouseMove, {
      mode: 'onlyOne',
    });
  }

  detach() {
    this.removeEventListener('mouseover', this.onMouseMove, {
      mode: 'onlyOne',
    });
  }
}

import { ResizeObserver } from '@juggle/resize-observer';

import { ViewportResizeEvent } from '@/events/viewport';
import { Engine } from '@/models/Engine';
import { EventDriver, globalThisPolyfill } from '@/utils';

export class ViewportResizeDriver extends EventDriver<Engine> {
  request: number | null = null;

  resizeObserver: ResizeObserver | null = null;

  onResize = (e: any) => {
    if (e.preventDefault) e.preventDefault();
    this.request = requestAnimationFrame(() => {
      if (typeof this.request === 'number') {
        cancelAnimationFrame(this.request);
      }
      this.dispatch(
        new ViewportResizeEvent({
          scrollX: this.contentWindow.scrollX,
          scrollY: this.contentWindow.scrollY,
          width: this.contentWindow.innerWidth,
          height: this.contentWindow.innerHeight,
          innerHeight: this.contentWindow.innerHeight,
          innerWidth: this.contentWindow.innerWidth,
          view: this.contentWindow,
          target: e.target || this.container,
        }),
      );
    });
  };

  attach() {
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.addEventListener('resize', this.onResize);
    } else {
      if (this.container && this.container !== document) {
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(this.container as HTMLElement);
      }
    }
  }

  detach() {
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.removeEventListener('resize', this.onResize);
    } else if (this.resizeObserver) {
      if (this.container && this.container !== document) {
        this.resizeObserver.unobserve(this.container as HTMLElement);
        this.resizeObserver.disconnect();
      }
    }
  }
}

import { ViewportScrollEvent } from '@/events/viewport';
import { Engine } from '@/models/Engine';
import { EventDriver, globalThisPolyfill } from '@/utils';

export class ViewportScrollDriver extends EventDriver<Engine> {
  request: number | null = null;

  onScroll = (e: UIEvent) => {
    e.preventDefault();
    this.request = globalThisPolyfill.requestAnimationFrame(() => {
      this.dispatch(
        new ViewportScrollEvent({
          scrollX: this.contentWindow.scrollX,
          scrollY: this.contentWindow.scrollY,
          width: this.contentWindow.document.body.clientWidth,
          height: this.contentWindow.document.body.clientHeight,
          innerHeight: this.contentWindow.innerHeight,
          innerWidth: this.contentWindow.innerWidth,
          view: this.contentWindow,
          target: e.target,
        }),
      );
      if (typeof this.request === 'number') {
        cancelAnimationFrame(this.request);
      }
    });
  };

  attach() {
    // @ts-ignore
    this.addEventListener('scroll', this.onScroll);
  }

  detach() {
    // @ts-ignore
    this.removeEventListener('scroll', this.onScroll);
  }
}

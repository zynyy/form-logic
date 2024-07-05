import { globalThisPolyfill } from '@/utils';

export interface IViewportEventData {
  scrollX: number;
  scrollY: number;
  width: number;
  height: number;
  view: Window;
  innerWidth: number;
  innerHeight: number;
  target: EventTarget | null;
}

export class AbstractViewportEvent {
  data: IViewportEventData;
  constructor(data: IViewportEventData) {
    this.data = data || {
      scrollX: globalThisPolyfill.scrollX,
      scrollY: globalThisPolyfill.scrollY,
      width: globalThisPolyfill.innerWidth,
      height: globalThisPolyfill.innerHeight,
      innerWidth: globalThisPolyfill.innerWidth,
      innerHeight: globalThisPolyfill.innerHeight,
      view: globalThisPolyfill,
      target: null,
    };
  }
}

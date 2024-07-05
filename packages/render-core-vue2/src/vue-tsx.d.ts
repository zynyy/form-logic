import 'vue';

declare module 'less-plugin-npm-import';
declare module 'less';
type EventHandler = (...args: any[]) => void;

declare module 'vue' {
  interface ComponentCustomProps {
    id?: string;
    role?: string;
    tabindex?: number;
    onClick?: EventHandler;
    onTouchend?: EventHandler;
    onTouchmove?: EventHandler;
    onTouchstart?: EventHandler;
    onTouchcancel?: EventHandler;
    onTouchmovePassive?: EventHandler;
    onTouchstartPassive?: EventHandler;
  }

  interface HTMLAttributes {
    onTouchmovePassive?: EventHandler;
    onTouchstartPassive?: EventHandler;
  }
}

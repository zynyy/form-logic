import PopoverBtn from './PopoverBtn';

export default PopoverBtn;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    PopoverBtn: typeof PopoverBtn;
  }
}

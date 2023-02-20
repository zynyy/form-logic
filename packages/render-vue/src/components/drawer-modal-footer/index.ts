import DrawerModalFooter from './DrawerModalFooter';

export default DrawerModalFooter;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    DrawerModalFooter: typeof DrawerModalFooter;
  }
}

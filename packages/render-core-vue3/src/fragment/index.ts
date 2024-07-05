import Fragment from './Fragment';

export default Fragment;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    Fragment: typeof Fragment;
  }
}

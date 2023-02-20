import Fragment from './Fragment';

export default Fragment;

declare module 'vue' {
  export interface GlobalComponents {
    Fragment: typeof Fragment;
  }
}

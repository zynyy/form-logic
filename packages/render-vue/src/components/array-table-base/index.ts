import ArrayTableBase from './ArrayTableBase';

export * from './interface';
export * from './hooks';

export default ArrayTableBase;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ArrayTableBase: typeof ArrayTableBase;
  }
}

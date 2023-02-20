import ArrayBase from './ArrayBase';

export * from './hooks';
export * from './interface';

export default ArrayBase;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ArrayBase: typeof ArrayBase;
  }
}

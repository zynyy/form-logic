import ArrayPagination from './ArrayPagination';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ArrayPagination: typeof ArrayPagination;
  }
}

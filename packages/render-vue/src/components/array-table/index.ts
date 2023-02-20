import ArrayTable from './ArrayTable';

export default ArrayTable;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ArrayTable: typeof ArrayTable;
  }
}

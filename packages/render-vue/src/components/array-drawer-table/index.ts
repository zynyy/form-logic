import ArrayDrawerTable from './ArrayDrawerTable';

export default ArrayDrawerTable;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ArrayDrawerTable: typeof ArrayDrawerTable;
  }
}

import ListTable from './ListTable';

export default ListTable;

export * from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    ListTable: typeof ListTable;
  }
}

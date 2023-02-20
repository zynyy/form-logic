import PaginationStatusSelect from './PaginationStatusSelect';

export default PaginationStatusSelect;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    PaginationStatusSelect: typeof PaginationStatusSelect;
  }
}

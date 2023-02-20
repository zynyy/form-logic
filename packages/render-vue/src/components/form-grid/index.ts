import FormGrid from './FormGrid';

export default FormGrid

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FormGrid: typeof FormGrid;
  }
}

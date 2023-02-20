import FormLayout from './FormLayout';

export default FormLayout;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FormLayout: typeof FormLayout;
  }
}

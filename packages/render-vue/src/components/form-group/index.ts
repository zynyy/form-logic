import FormGroup from './FormGroup';

export default FormGroup;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FormGroup: typeof FormGroup;
  }
}

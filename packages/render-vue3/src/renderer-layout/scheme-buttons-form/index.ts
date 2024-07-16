import SchemeButtonsForm from './SchemeButtonsForm';

export default SchemeButtonsForm;

export * from './interface';

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    SchemeButtonsForm: typeof SchemeButtonsForm;
  }
}

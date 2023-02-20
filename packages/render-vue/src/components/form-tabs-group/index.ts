import FormTabsGroup from './FormTabsGroup';

export default FormTabsGroup;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FormTabsGroup: typeof FormTabsGroup;
  }
}

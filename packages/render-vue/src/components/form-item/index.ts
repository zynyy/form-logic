import FormItem from './FormItem';

export default FormItem;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    FormItem: typeof FormItem;
  }
}

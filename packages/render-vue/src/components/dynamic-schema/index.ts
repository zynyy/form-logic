import DynamicSchema from './DynamicSchema';

export default DynamicSchema;

declare module 'vue' {
  // Volar
  export interface GlobalComponents {
    DynamicSchema: typeof DynamicSchema;
  }
}

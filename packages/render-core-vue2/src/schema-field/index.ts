import { createSchemaField } from './createSchemaField';
import RecursionField from './RecursionField';

export * from './interface';

export {
  provideSchemaComponents,
  provideSchemaScope,
  useFieldSchema,
  useSchemaComponentsContext,
  useSchemaScopeContext,
} from './hooks';
export type { SchemaComponentsRef, SchemaScopeRef } from './hooks';

export { RecursionField, createSchemaField };

declare module 'vue' {
  export interface GlobalComponents {
    RecursionField: typeof RecursionField;
    SchemaField: ReturnType<typeof createSchemaField>['SchemaField'];
  }
}

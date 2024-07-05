import { createSchemaField } from './createSchemaField';

export { createSchemaField };

export * from './interface';

import RecursionField from './RecursionField';

export {
  provideSchemaComponents,
  provideSchemaScope,
  useFieldSchema,
  useSchemaComponentsContext,
  useSchemaScopeContext,
} from './hooks';
export type { SchemaComponentsRef, SchemaScopeRef } from './hooks';

export { RecursionField };

declare module 'vue' {
  export interface GlobalComponents {
    RecursionField: typeof RecursionField;
    SchemaField: ReturnType<typeof createSchemaField>['SchemaField'];
  }
}

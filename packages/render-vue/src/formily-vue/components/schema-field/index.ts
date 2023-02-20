import { createSchemaField } from './createSchemaField';

export { createSchemaField };

export * from './interface';

import RecursionField from './RecursionField';

export {
  useSchemaScopeContext,
  useSchemaComponentsContext,
  provideSchemaScope,
  provideSchemaComponents,
  useFieldSchema,
} from './hooks';

export type { SchemaScopeRef, SchemaComponentsRef } from './hooks';

export { RecursionField };

declare module 'vue' {
  export interface GlobalComponents {
    RecursionField: typeof RecursionField;
    SchemaField: ReturnType<typeof createSchemaField>['SchemaField'];
  }
}

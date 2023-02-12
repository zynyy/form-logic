import { createSchemaField } from './createSchemaField';

export { createSchemaField };

export type { SchemaFieldProps } from './interface';
export { getSchemaFieldProps } from './interface';

import { withInstall } from '@/utils';

import _RecursionField from './RecursionField';

export const RecursionField = withInstall(_RecursionField);

export {
  useSchemaScopeContext,
  useSchemaComponentsContext,
  provideSchemaScope,
  provideSchemaComponents,
  useFieldSchema
} from './hooks';

export type { SchemaScopeRef, SchemaComponentsRef } from './hooks';

declare module 'vue' {
  export interface GlobalComponents {
    RecursionField: typeof RecursionField;
    SchemaField: ReturnType<typeof createSchemaField>['SchemaField'];
  }
}

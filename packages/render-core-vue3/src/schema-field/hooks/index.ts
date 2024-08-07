import { inject, InjectionKey, provide, Ref, ref } from 'vue';

import { SchemaVueComponents } from '@/interface';
import Schema from '@/json-schema';

export type SchemaComponentsRef = Ref<SchemaVueComponents>;

export const SchemaComponentsSymbol: InjectionKey<SchemaComponentsRef> = Symbol('schemaComponents');

export const useSchemaComponentsContext = (): SchemaComponentsRef => {
  return inject(SchemaComponentsSymbol, ref({})) as any;
};

export const provideSchemaComponents = (schemaComponents: SchemaComponentsRef) => {
  provide(SchemaComponentsSymbol, schemaComponents);
};

export type SchemaScopeRef = Ref<any>;

export const SchemaScopeSymbol: InjectionKey<SchemaScopeRef> = Symbol('schemaScope');

export const useSchemaScopeContext = (): SchemaScopeRef => {
  return inject(SchemaScopeSymbol, ref()) as any;
};

export const provideSchemaScope = (schemaScope: SchemaScopeRef) => {
  provide(SchemaScopeSymbol, schemaScope);
};

export const SchemaSymbol: InjectionKey<Ref<Schema>> = Symbol('schema');

export const useFieldSchema = () => {
  return inject(SchemaSymbol, ref());
};

export const provideFieldSchema = (fieldSchema: Ref<Schema>) => {
  provide(SchemaSymbol, fieldSchema);
};

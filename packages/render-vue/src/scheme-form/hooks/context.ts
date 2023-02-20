import { AnyObject, EventsObject, LogicConfig, SchemaPattern } from '@/interface';
import {InjectionKey, inject, provide, Ref, ref} from 'vue';

export interface SchemeFormValueContent {
  pattern?: SchemaPattern;
  getLogicConfig?: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
}

export type SchemeFormValueContentRef = Ref<SchemeFormValueContent>;

export const SchemeFormValueContentSymbol: InjectionKey<SchemeFormValueContentRef> =
  Symbol('SchemeFormValueContent');

export const useSchemeFormContent = (): SchemeFormValueContentRef => {
  return inject(SchemeFormValueContentSymbol, ref({}));
};

export const provideSchemeForm = (schemeFormValueContent: SchemeFormValueContentRef) => {
  provide(SchemeFormValueContentSymbol, schemeFormValueContent);
};

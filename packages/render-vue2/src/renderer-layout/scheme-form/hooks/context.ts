import { EventsObject, SchemaPattern, SchemaPatternEnum } from '@formlogic/render-core-vue2';
import { InjectionKey, Ref, computed, inject, provide, ref } from 'vue';

import { AnyObject, LogicConfig } from '@/interface';

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

export const useSchemePattern = () => {
  const formContent = useSchemeFormContent();

  return computed(() => {
    const patter = formContent.value.pattern;

    return {
      isDetailPatter: patter === SchemaPatternEnum.DETAIL,
      isDisabledPatter: patter === SchemaPatternEnum.DISABLED,
      isEditablePatter: patter === SchemaPatternEnum.EDITABLE || !patter,
    };
  });
};

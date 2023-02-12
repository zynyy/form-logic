import './style';
import { App } from 'vue';
import { withInstall } from '@/utils';

export * from './transforms';

export * from './hooks';

export * from './interface';

export * from './utils/formUtils';

export * from '@/utils';

export { default as SchemeForm } from './scheme-form';

export type { SchemeFormProps } from './scheme-form/interface';

export type { SchemeFormValueContent } from './scheme-form/hooks';

export { EFFECT_HOOK_GROUP } from '@/utils/constant';

export { default as ExecLogic } from './exec-logic';

export { useForm, useField, useFieldSchema, RecursionField } from '@/formily-vue';

export type { ISchema } from '@formily/json-schema';
export { observer } from '@/utils/observer';

export {
  createEffectHook,
  isField,
  isArrayField,
  isVoidField,
  isObjectField,
  isDataField,
  isGeneralField,
  useEffectForm,
  registerValidateRules,
  registerValidateLocale,
  isForm,
} from '@formily/core';

export type {
  Form as FormilyForm,
  IFormProps as FormConfigProps,
  Field as FormilyField,
  JSXComponent,
} from '@formily/core';

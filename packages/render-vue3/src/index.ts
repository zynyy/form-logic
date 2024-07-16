import './style';

import { registerValidateRules } from '@formlogic/render-core-vue3';

import rules from '@/utils/rules';

registerValidateRules(rules);

export * from '@/utils';
export {
  EFFECT_HOOK_GROUP,
  FIELD_TYPE_DATA,
  LIST_FILED_CODE,
  MetaDataTypeEnum,
  REQUEST_METHOD,
  VALIDATE_RULES,
  VALIDATOR_TRIGGER,
} from '@/utils/constant';
export * from '@formlogic/render-core-vue3';
export * from './config';
export { onFormInputChange, onFormValuesChange } from './effect-hook';
export * from './exec-logic';
export * from './hooks';
export { SchemaComponents, default as useSchemaField } from './hooks/useSchemaField';
export * from './interface';
export * from './renderer-layout';
export * from './transforms';
export * from './utils/formUtils';
export { default as invokeKeys } from './utils/invokeKeys';

import { install } from './install';

export default install;

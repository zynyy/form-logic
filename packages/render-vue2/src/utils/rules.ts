import {
  IRegistryRules,
  isArr,
  isEmpty,
  isValid,
  IValidatorRules,
  RULES as originRules,
  toJS,
} from '@formlogic/render-core-vue2';

import { compileTpl, request } from '@/utils/index';

export const isValidateEmpty = (value: any) => {
  if (isArr(value)) {
    for (let i = 0; i < value.length; i++) {
      if (isValid(value[i])) return false;
    }
    return true;
  } else {
    return isEmpty(value);
  }
};

const remoteCheckUniq = async (value: any, rule: IValidatorRules, ctx: any) => {
  if (isValidateEmpty(value)) return '';
  const { remoteCheckUniq, message } = rule;

  const { apiConfig } = remoteCheckUniq || {};

  const formValues = toJS(ctx.form.values);

  const errMsg = message ?? '{{field.title}}重复。请重新输入';

  try {
    const res = await request(
      compileTpl(apiConfig, {
        formValues,
      }),
    );
    const { data } = res;
    return data ? errMsg : '';
  } catch {
    return errMsg;
  }
};

const RULES: IRegistryRules = {
  ...originRules,
  remoteCheckUniq,
};

export default RULES;

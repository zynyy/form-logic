import { registerValidateLocale } from '@formily/core';
import { isArr, isEmpty, isValid } from '@formily/shared';
import { IRegistryRules, IValidatorRules } from '@formily/validator';
import { ValidatorFunction } from '@formily/validator/esm/types';

import {
  CODE_PATTERN,
  DATE_PATTERN,
  EMAIL_PATTERN,
  INTEGER_PATTERN,
  IP4_PATTERN,
  IP6_PATTERN,
  NUMBER_PATTERN,
  ORIGIN_DOMAIN,
  PATHNAME,
  PHONE_PATTERN,
  START_LETTER_NUM_SPECIAL_CHARACTERS,
  START_LETTER_NUM_UNDERLINE,
  URL_PATTERN,
} from './pattern';

registerValidateLocale({
  'zh-CN': {
    url: 'URL不合法,请重新输入',
    email: '邮箱不合法,请重新输入',
    ip4: 'ip4不合法,请重新输入',
    ip6: 'ip6不合法,请重新输入',
    ip: 'ip不合法,请重新输入',
    pathname: '{{field.title}}不合法,请重新输入',
    originDomain: '域名不合法,请重新输入',
    codingRules: '{{field.title}}只支持小写英文字母和英文句号',
    remoteCheckUniq: '{{field.title}}重复。请重新输入',
    startLetterNumUnderline: '{{field.title}}只支持字母开头、仅包含大小写字母+数字+下划线',
    startLetterNumSpecialCharacters:
      '{{field.title}}只支持字母开头、仅包含大小写字母+数字+特殊字符(!@#$%^&*()_+-=,.<>?/|[]{})',
  },
});

const patternFn = (pattern: RegExp): ValidatorFunction => {
  return (value, rule) => {
    if (isValidateEmpty(value)) return '';
    const errMsg = rule.message as string;
    return !pattern.test(value) ? errMsg : '';
  };
};

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

export const RULES: IRegistryRules = {
  required(value: any, rule: IValidatorRules, ctx) {
    if (rule.required === false) return '';

    const { message } = rule;

    let errMsg = '请输入{{field.title}}';
    if (ctx.field.componentType?.toString().toLocaleLowerCase().includes('select')) {
      errMsg = '请选择{{field.title}}';
    }
    if (ctx.field.componentType?.toString().toLocaleLowerCase().includes('upload')) {
      errMsg = '请上传{{field.title}}';
    }
    if (ctx.field.componentType?.toString().toLocaleLowerCase().includes('checkbox')) {
      errMsg = '请勾选{{field.title}}';
    }

    errMsg = message && /\{\{(.+?)\}\}/g.test(message) ? message : errMsg;

    return isValidateEmpty(value) ? errMsg : '';
  },
  pattern(value, rule) {
    if (isValidateEmpty(value)) return '';
    const errMsg = rule.message as string;
    return !new RegExp(rule.pattern ?? '').test(value) ? errMsg : '';
  },
  url: patternFn(URL_PATTERN),
  email: patternFn(EMAIL_PATTERN),
  number: patternFn(NUMBER_PATTERN),
  date: patternFn(DATE_PATTERN),
  integer: patternFn(INTEGER_PATTERN),
  phone: patternFn(PHONE_PATTERN),
  ip4: patternFn(IP4_PATTERN),
  ip6: patternFn(IP6_PATTERN),
  originDomain: patternFn(ORIGIN_DOMAIN),
  codingRules: patternFn(CODE_PATTERN),
  pathname: patternFn(PATHNAME),
  startLetterNumUnderline: patternFn(START_LETTER_NUM_UNDERLINE),
  startLetterNumSpecialCharacters: patternFn(START_LETTER_NUM_SPECIAL_CHARACTERS),
  ip: (value, rule) => {
    if (isValidateEmpty(value)) return '';

    const arrayVal = Array.isArray(value) ? value : value.split(',');

    const invalidIp = arrayVal.find((ip: string) => {
      if (IP4_PATTERN.test(ip)) {
        return false;
      }
      return !IP6_PATTERN.test(ip);
    });

    const { message } = rule;

    let errMsg = `${invalidIp}无效ip,请重新输入`;

    errMsg = message && /\{\{(.+?)\}\}/g.test(message) ? message : errMsg;

    return invalidIp ? errMsg : '';
  },
};

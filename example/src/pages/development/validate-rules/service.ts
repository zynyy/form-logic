import { requestGet, requestPost } from '@/service';

export enum ValidateRulesConfig {
  CREATE = 'FormValidateRules_C',
  DETAIL = 'FormValidateRules_D',
  EDIT = 'FormValidateRules_U',
  LIST = 'FormValidateRules_L',

  CREATE_LINK = '/development/validate-rules/create',
  EDIT_LINK = '/development/validate-rules/edit',
  DETAIL_LINK = '/development/validate-rules/detail',

  MODEL_CODE = 'FormValidateRules',
}

const baseUrl = 'local-api/validate-rules';

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
  page: `${baseUrl}/page`, // 列表接口
};



export interface ValidateRulesCreateParams {
  [key: string]: any;
}

export interface ValidateRulesDetailParams {
  [key: string]: any;
}

export interface ValidateRulesUpdateParams {
  [key: string]: any;
}

export interface ValidateRulesRemoveParams {
  [key: string]: any;
}

// 新增
export const validateRulesCreate = (params: ValidateRulesCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const validateRulesUpdate = (params: ValidateRulesUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const validateRulesDetail = (params: ValidateRulesDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 详情页
export const validateRulesRemove = (params: ValidateRulesRemoveParams) => {
  return requestPost(apiUrl.remove, params);
};

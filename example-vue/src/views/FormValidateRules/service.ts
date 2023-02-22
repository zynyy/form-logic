import { requestGet, requestPost, requestDelete } from "@/service";

export enum FormvalidaterulesConfig {
  CREATE = "FormValidateRules_C",
  DETAIL = "FormValidateRules_D",
  EDIT = "FormValidateRules_U",
  LIST = "FormValidateRules_L",

  CREATE_LINK = "/FormValidateRules/create",
  EDIT_LINK = "/FormValidateRules/edit",
  DETAIL_LINK = "/FormValidateRules/detail",

  MODEL_CODE = "FormValidateRules",
}

const baseUrl = "local-api/validate-rules";

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
  page: `${baseUrl}/page`, // 列表接口
};

export interface FormvalidaterulesCreateParams {
  [key: string]: any;
}

export interface FormvalidaterulesDetailParams {
  [key: string]: any;
}

export interface FormvalidaterulesUpdateParams {
  [key: string]: any;
}

export interface FormvalidaterulesRemoveParams {
  [key: string]: any;
}

// 新增
export const formvalidaterulesCreate = (
  params: FormvalidaterulesCreateParams
) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const formvalidaterulesUpdate = (
  params: FormvalidaterulesUpdateParams
) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const formvalidaterulesDetail = (
  params: FormvalidaterulesDetailParams
) => {
  return requestGet(apiUrl.detail, params);
};

// 详情页
export const formvalidaterulesRemove = (
  params: FormvalidaterulesRemoveParams
) => {
  return requestDelete(apiUrl.remove, params);
};

import { requestGet, requestPost, requestDelete } from "@/service";

export enum LinkConfig {
  CREATE = "FormValidateRules_C",
  DETAIL = "FormValidateRules_D",
  EDIT = "FormValidateRules_U",
  LIST = "FormValidateRules_L",

  CREATE_LINK = "/link/create",
  EDIT_LINK = "/link/edit",
  DETAIL_LINK = "/link/detail",

  MODEL_CODE = "FormValidateRules",
}

const baseUrl = "/local-api/validate-rules";

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
  page: `${baseUrl}/page`, // 列表接口
};

export interface LinkCreateParams {
  [key: string]: any;
}

export interface LinkDetailParams {
  [key: string]: any;
}

export interface LinkUpdateParams {
  [key: string]: any;
}

export interface LinkRemoveParams {
  [key: string]: any;
}

// 新增
export const linkCreate = (params: LinkCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const linkUpdate = (params: LinkUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const linkDetail = (params: LinkDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 详情页
export const linkRemove = (params: LinkRemoveParams) => {
  return requestDelete(apiUrl.remove, params);
};

import { requestGet, requestPost, requestDelete } from "@/service";

export enum DrawerConfig {
  CREATE = "FormValidateRules_C",
  DETAIL = "FormValidateRules_D",
  EDIT = "FormValidateRules_U",
  LIST = "FormValidateRules_L",

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

export interface DrawerCreateParams {
  [key: string]: any;
}

export interface DrawerDetailParams {
  [key: string]: any;
}

export interface DrawerUpdateParams {
  [key: string]: any;
}

export interface DrawerRemoveParams {
  [key: string]: any;
}

// 新增
export const drawerCreate = (params: DrawerCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const drawerUpdate = (params: DrawerUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const drawerDetail = (params: DrawerDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 详情页
export const drawerRemove = (params: DrawerRemoveParams) => {
  return requestDelete(apiUrl.remove, params);
};

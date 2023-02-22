import { requestGet, requestPost, requestDelete } from "@/service";

export enum ListConfig {
  CREATE = "List_C",
  DETAIL = "List_D",
  EDIT = "List_U",
  LIST = "List_L",

  CREATE_LINK = "/list/create",
  EDIT_LINK = "/list/edit",
  DETAIL_LINK = "/list/detail",

  MODEL_CODE = "List",
}

const baseUrl = "/list";

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
  page: `${baseUrl}/page`, // 列表接口
};

export interface ListCreateParams {
  [key: string]: any;
}

export interface ListDetailParams {
  [key: string]: any;
}

export interface ListUpdateParams {
  [key: string]: any;
}

export interface ListRemoveParams {
  [key: string]: any;
}

// 新增
export const listCreate = (params: ListCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const listUpdate = (params: ListUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const listDetail = (params: ListDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 详情页
export const listRemove = (params: ListRemoveParams) => {
  return requestDelete(apiUrl.remove, params);
};

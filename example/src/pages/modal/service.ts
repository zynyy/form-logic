import { requestDelete, requestGet, requestPost } from '@/service';

export enum ModalConfig {
  CREATE = 'Modal_C',
  DETAIL = 'Modal_D',
  EDIT = 'Modal_U',
  LIST = 'Modal_L',

  MODEL_CODE = 'Modal',
}

const baseUrl = '/modal';

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
  page: `${baseUrl}/page`, // 列表接口
};

export interface ModalCreateParams {
  [key: string]: any;
}

export interface ModalDetailParams {
  [key: string]: any;
}

export interface ModalUpdateParams {
  [key: string]: any;
}

export interface ModalRemoveParams {
  [key: string]: any;
}

// 新增
export const modalCreate = (params: ModalCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const modalUpdate = (params: ModalUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const modalDetail = (params: ModalDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 详情页
export const modalRemove = (params: ModalRemoveParams) => {
  return requestDelete(apiUrl.remove, params);
};

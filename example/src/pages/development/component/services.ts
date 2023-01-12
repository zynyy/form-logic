import { requestDelete, requestGet, requestPost } from '@/service';

export enum ComponentConfig {
  CREATE = 'Component_C',
  DETAIL = 'Component_D',
  EDIT = 'Component_U',
  LIST = 'Component_L',
  MODEL_CODE = 'Component',
  CREATE_LINK = '/development/component/create',
  EDIT_LINK = '/development/component/edit',
  DETAIL_LINK = '/development/component/detail',
}

const baseUrl = 'local-api/component';

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  page: `${baseUrl}/page`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
};

export interface ComponentCreateParams extends DynamicObjectAny {}

export interface ComponentUpdateParams extends DynamicObjectAny {}

export interface ComponentDetailParams extends DynamicObjectAny {}

export interface ComponentRemoveParams extends DynamicObjectAny {}


// 新增
export const componentCreate = (params: ComponentCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const componentUpdate = (params: ComponentUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const componentDetail = (params: ComponentDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 删除
export const componentRemove = (params: ComponentRemoveParams) => {
  return requestDelete(apiUrl.remove, params);
};

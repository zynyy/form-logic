import { requestDelete, requestGet, requestPost } from '@/service';

export enum ModelPageConfig {
  CREATE = 'ModelPage_C',
  DETAIL = 'ModelPage_D',
  EDIT = 'ModelPage_U',
  LIST = 'ModelPage_L',
  BATCH_ADD_FIELD = 'ModelPage_BatchAdd_C',
  MODEL_CODE = 'ModelPage',
  CREATE_LINK = '/development/model-page/create',
  EDIT_LINK = '/development/model-page/edit',
  DETAIL_LINK = '/development/model-page/detail',
}

const baseUrl = 'local-api/model-page';

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
  page: `${baseUrl}/page`, // 编辑
};

export interface ModelPageCreateParams extends DynamicObjectAny {}


export interface ModelPageDetailParams extends DynamicObjectAny {}

export interface ModelPageUpdateParams extends DynamicObjectAny {}


export interface ModelPageRemoveParams extends DynamicObjectAny {}

// 新增
export const modelPageCreate = (params: ModelPageCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const modelPageUpdate = (params: ModelPageUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const modelPageDetail = (params: ModelPageDetailParams) => {
  return requestGet(apiUrl.detail, params);
};


// 详情页
export const modelPageRemove = (params: ModelPageRemoveParams) => {
  return requestDelete(apiUrl.remove, params);
};

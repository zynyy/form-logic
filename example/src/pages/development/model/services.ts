import { requestGet, requestPost } from '@/service';

export enum ModelConfig {
  CREATE = 'Model_C',
  DETAIL = 'Model_D',
  EDIT = 'Model_U',
  LIST = 'Model_L',
  MODEL_CODE = 'Model',
  CREATE_LINK = '/development/model/create',
  EDIT_LINK = '/development/model/edit',
  DETAIL_LINK = '/development/model/detail',
}

const baseUrl = 'local-api/model';

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  page: `${baseUrl}/page`, // 编辑
};

export interface ModelCreateParams extends DynamicObjectAny {}

export interface ModelSaveParams extends DynamicObjectAny {}

export interface ModelDetailParams extends DynamicObjectAny {}

export interface ModelUpdateParams extends DynamicObjectAny {}

// 新增
export const modelCreate = (params: ModelCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const modelUpdate = (params: ModelUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const modelDetail = (params: ModelDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

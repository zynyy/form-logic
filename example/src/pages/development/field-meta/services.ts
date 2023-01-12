import { requestGet, requestPost } from '@/service';

export enum FieldMetaConfig {
  CREATE = 'FieldMeta_C',
  DETAIL = 'FieldMeta_D',
  EDIT = 'FieldMeta_U',
  LIST = 'FieldMeta_L',
  MODEL_CODE = 'FieldMeta',
  CREATE_LINK = '/development/field-meta/create',
  EDIT_LINK = '/development/field-meta/edit',
  DETAIL_LINK = '/development/field-meta/detail',
}

const baseUrl = 'local-api/field-meta';

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  page: `${baseUrl}/page`, // 编辑
  remove: `${baseUrl}/remove`, // 编辑
  tree: `${baseUrl}/tree`, // 树形
};

export interface FieldMetaCreateParams extends DynamicObjectAny {}

export interface FieldMetaRemoveParams extends DynamicObjectAny {}

export interface FieldMetaDetailParams extends DynamicObjectAny {}

export interface FieldMetaUpdateParams extends DynamicObjectAny {}

export interface FieldMetaTreeParams extends DynamicObjectAny {}

// 新增
export const fieldMetaCreate = (params: FieldMetaCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const fieldMetaUpdate = (params: FieldMetaUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const fieldMetaDetail = (params: FieldMetaDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 删除
export const fieldMetaRemove = (params: FieldMetaRemoveParams) => {
  return requestGet(apiUrl.remove, params);
};

// 树形
export const fieldMetaTree = (params?: FieldMetaTreeParams) => {
  return requestGet(apiUrl.tree, params);
};

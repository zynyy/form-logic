import { requestDelete, requestGet, requestPost } from '@/service';

export enum LogicConfig {
  CREATE = 'Logic_C',
  DETAIL = 'Logic_D',
  EDIT = 'Logic_U',
  LIST = 'Logic_L',
  MODEL_CODE = 'Logic',
  CREATE_LINK = '/development/logic/create',
  EDIT_LINK = '/development/logic/edit',
  DETAIL_LINK = '/development/logic/detail',
}

const baseUrl = 'local-api/logic';

export const apiUrl = {
  detail: `${baseUrl}/detail`, // 详情
  create: `${baseUrl}/create`, // 新增
  update: `${baseUrl}/update`, // 编辑
  page: `${baseUrl}/page`, // 编辑
  remove: `${baseUrl}/remove`, // 删除
};

export interface LogicCreateParams extends DynamicObjectAny {}

export interface LogicDetailParams extends DynamicObjectAny {}

export interface LogicUpdateParams extends DynamicObjectAny {}

// 新增
export const logicCreate = (params: LogicCreateParams) => {
  return requestPost(apiUrl.create, params);
};

// 编辑更新
export const logicUpdate = (params: LogicUpdateParams) => {
  return requestPost(apiUrl.update, params);
};

// 详情页
export const logicDetail = (params: LogicDetailParams) => {
  return requestGet(apiUrl.detail, params);
};

// 详情页
export const logicRemove = (params: LogicDetailParams) => {
  return requestDelete(apiUrl.remove, params);
};

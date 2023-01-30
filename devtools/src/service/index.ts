import { requestGet, requestPost } from '@/utils/request';
import { ApiConfig } from '@formlogic/render';

import { LogicItem } from '@formlogic/editor';

export const apiUrl = {
  localDetail: `/local-api/detail`, // 详情
  localSave: '/local-api/save', // 保存
  localConnect: '/local-api/connect', // 提交
  localUpdateConfig: '/local-api/localUpdateConfig', // 编辑
  localConfig: '/local-api/localConfig', // 编辑
  localPageConfigList: '/local-api/page-config/list',
  localModelList: '/local-api/model/list',
  modelPageDetail: '/local-api/model-page/detail',
  updateModelPageLogic: '/local-api/model-page/updateLogic',
  modelPageBatchDetail: '/local-api/model-page/batchDetail',
  modelPageUpdate: '/local-api/model-page/update',
};

export const getLocalConfig = () => {
  return requestGet(apiUrl.localConfig);
};

export const updateLocalConfig = (params: any) => {
  return requestPost(apiUrl.localUpdateConfig, params);
};

export const localSave = (params: any) => {
  return requestPost(apiUrl.localSave, params);
};

export const getLocalDetail = (params: any) => {
  return requestGet(apiUrl.localDetail, params);
};

export const getData = ({ method, params, url }: ApiConfig) => {
  switch (method.toLocaleLowerCase()) {
    case 'post': {
      return requestPost(url, params);
    }
    default: {
      return requestGet(url, params);
    }
  }
};

export interface ModelPageDetailParams {
  pageCode: string;
}

export const getModelPageDetail = (params: ModelPageDetailParams) => {
  return requestGet(apiUrl.modelPageDetail, params);
};

export interface ModelPageBatchDetailParams {
  pageCodes: string[];
}

export const getModelPageBatchDetail = (params: ModelPageBatchDetailParams) => {
  return requestGet(apiUrl.modelPageBatchDetail, params);
};

export interface UpdateModelPageLogicParams {
  pageCode: string;
  logics: LogicItem[];
}

export const updateModelPageLogic = (params: UpdateModelPageLogicParams) => {
  return requestPost(apiUrl.updateModelPageLogic, params);
};


export { requestGet, requestPost, requestDelete, requestPut } from '@/utils/request';

import { requestGet, requestPost } from '@/utils/request';
import { ApiConfig } from '@/interface';

export const apiUrl = {
  localSave: '/local-api/logic/save', // 保存
  localPkgDeps: '/local-api/pkgDependencies', // 保存
  localConnect: '/local-api/connect', // 提交
  localLogicDetail: '/local-api/logic/detail', // 提交
  localPageConfigDetail: '/local-api/pageConfigDetail',
  localBelongList: '/local-api/model-or-page/list',
  modelLogicList: '/local-api/model-logic/list',
};

export const localSave = (params: any) => {
  return requestPost(apiUrl.localSave, params);
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

export const getPageConfigDetail = (params: any) => {
  return requestGet(apiUrl.localPageConfigDetail, params);
};

export const getLogicDetail = (params) => {
  return requestGet(apiUrl.localLogicDetail, params);
};

export const getPkgDeps = () => {
  return requestGet(apiUrl.localPkgDeps);
};

export const testLocalConnect = () => {
  return requestGet(apiUrl.localConnect);
};

export const modelLogicList = (params) => {
  return requestGet(apiUrl.modelLogicList, params);
};

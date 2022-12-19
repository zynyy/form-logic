import { requestGet, requestPost } from '@/utils/request';

export const apiUrl = {
  localSave: '/local-api/save', // 保存
  localPkgDeps: '/local-api/pkgDependencies', // 保存
  localConnect: '/local-api/connect', // 提交
  localLogicDetail: '/local-api/logicDetail', // 提交
  localPageConfigDetail: '/local-api/pageConfigDetail',
};

export interface DataApiConfig {
  method: 'post' | 'get';
  url: string;
  params: any;
}

export const localSave = (params: any) => {
  return requestPost(apiUrl.localSave, params);
};

export const getData = ({ method, params, url }: DataApiConfig) => {
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

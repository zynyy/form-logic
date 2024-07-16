import { requestGet, requestPost, requestDelete } from '@/utils/request';
import { ApiConfig, ApiPagination } from '@/interface';

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
  detailsByCode: '/system/formDesignPage/detailsByCode',
  formQueryData: '/system/formQueryData',
  saveAgDataColumn: '/system/agdata',
  getAgGridColumn: '/system/agdata/query',
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

export const getPagination = ({ method, params, url, data }: ApiPagination) => {
  switch (method.toLocaleLowerCase()) {
    case 'post': {
      return requestPost(url, params, data);
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

export interface LogicItem {
  fieldCode: string;
  fieldType: string;
  effectHook: string;
  logicCode: string;
}

export interface UpdateModelPageLogicParams {
  pageCode: string;
  logics: LogicItem[];
}

export const updateModelPageLogic = (params: UpdateModelPageLogicParams) => {
  return requestPost(apiUrl.updateModelPageLogic, params);
};

export const formQueryDataSave = (data: any) => {
  return requestPost(apiUrl.formQueryData, data);
};

export const formQueryDataDel = (data: any) => {
  return requestDelete(apiUrl.formQueryData, data);
};

export const saveAgData = (data: any) => {
  return requestPost(apiUrl.saveAgDataColumn, data);
};

export const getAgGridColumns = (data: any) => {
  return requestPost(apiUrl.getAgGridColumn, data);
};

export {
  requestGet,
  requestPost,
  requestDelete,
  requestPut,
} from '@/utils/request';

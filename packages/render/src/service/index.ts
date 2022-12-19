import {requestGet, requestPost} from "@/utils/request";

export const apiUrl = {
  localDetail: `/local-api/detail`, // 详情
  localSave: "/local-api/save", // 保存
  localConnect: "/local-api/connect", // 提交
  localUpdateConfig: "/local-api/localUpdateConfig", // 编辑
  localConfig: "/local-api/localConfig", // 编辑
  localPageConfigDetail: "/local-api/pageConfigDetail"
};

export interface DataApiConfig {
  method: "post" | "get";
  url: string;
  params: any;
}

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

export const getData = ({ method, params, url }: DataApiConfig) => {
  switch (method.toLocaleLowerCase()) {
    case "post": {
      return requestPost(url, params);
    }
    default: {
      return requestGet(url, params);
    }
  }
};

export const getPageConfigDetail = (params: any) => {
  return requestGet(apiUrl.localPageConfigDetail, params)
}

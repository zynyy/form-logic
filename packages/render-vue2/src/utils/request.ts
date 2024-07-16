// https://github.com/axios/axios#axios-api

import type { InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

const _request = axios.create({
  withCredentials: true,
  timeout: 30000,
});

export interface BackEndData {
  code: number;
  data: any;
  message: string;
}

export type RequestBackEndData = Promise<BackEndData>;

export type RequestConfig = Partial<
  InternalAxiosRequestConfig & {
    noLoading?: boolean;
  }
>;

const request = (config: RequestConfig): RequestBackEndData => {
  return _request({
    noLoading: true,
    baseURL: '/api',
    ...config,
  }).then((res: any) => {
    if (res.name === 'AxiosError') {
      return Promise.reject(res.response.data);
    }
    return Promise.resolve(res);
  });
};

export const requestGet = (
  url: string,
  params?: any,
  config?: RequestConfig,
): RequestBackEndData => {
  return request({
    ...config,
    method: 'GET',
    url,
    params,
  });
};

export const requestPost = (
  url: string,
  data?: any,
  config?: RequestConfig,
): RequestBackEndData => {
  return request({
    noLoading: true,
    ...config,
    method: 'POST',
    url,
    data,
  });
};

export const requestDelete = (
  url: string,
  data?: any,
  config?: RequestConfig,
): RequestBackEndData => {
  return request({
    noLoading: true,
    ...config,
    method: 'DELETE',
    url,
    data,
  });
};

export const requestPut = (url: string, data?: any, config?: RequestConfig): RequestBackEndData => {
  return request({
    noLoading: true,
    ...config,
    method: 'PUT',
    url,
    data,
  });
};

export const getModelPageDetail = (pageCode: string) => {
  return requestGet('/render/model-page/detailByCode', {
    code: pageCode,
  }).then((res) => {
    const { data } = res;

    if (data) {
      const { data: originData, pageGroup, layoutComponentProps, ...rest } = data;
      return {
        ...rest,
        data: typeof originData === 'string' ? JSON.parse(originData || '[]') : originData,
        group: typeof pageGroup === 'string' ? JSON.parse(pageGroup || '[]') : pageGroup,
        layoutComponentProps:
          typeof layoutComponentProps === 'string'
            ? JSON.parse(layoutComponentProps || '{}')
            : layoutComponentProps,
      };
    }

    return Promise.reject(data);
  });
};

export const getBatchModelPageDetail = (pageCodes: string[]) => {
  return requestGet('/render/model-page/listByCode', {
    codeList: pageCodes.join(','),
  })
    .then((res) => {
      const { data } = res;

      const metaSchemas: Record<string, any> = {};

      pageCodes.forEach((pageCode) => {
        const record = data.find((item: any) => item.code === pageCode);

        if (record) {
          metaSchemas[pageCode] = record;
        }
      });

      return metaSchemas;
    })
    .catch((err) => Promise.reject(err));
};

export default request;

// https://github.com/axios/axios#axios-api

import { message } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { isError } from '@/utils/is';

import mustache from 'mustache';

// https://tools.ietf.org/html/rfc2616#section-10
// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
const HTTPStatusCodeMessage = {
  404: '请求失败，接口不存在 {{&url}}',
  504: '请求失败 网关超时 {{&url}}',
  500: '请求失败 后端接口处理出错 {{&url}}',
};

const serviceInstance = axios.create({
  baseURL: `${window.location.protocol}//${window.location.host}/`,
  // timeout: 3000, // 设置超时时间
});

/**
 * 请求拦截器
 */
serviceInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // https://github.com/axios/axios#request-config

    return config;
  },
  (error: any) => {
    console.error(error);
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 */
serviceInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // https://github.com/axios/axios#response-schema
    const { data } = response;

    const { code, msg } = data;
    if (Number(code) !== 200) {
      message.error(msg).then(() => void 0);
      return Promise.reject(data);
    }

    return Promise.resolve(data);
  },
  (error: any) => {
    if (error?.isAxiosError) {
      const { config } = error || {};

      const { url } = config || {};

      const code = error.request.status;

      if (Reflect.has(HTTPStatusCodeMessage, code)) {
        message.error(mustache.render(HTTPStatusCodeMessage[code], { url })).then(() => void 0);
      } else {
        message.error(error.message).then(() => void 0);
      }
    } else if (isError(error)) {
      const messageArray: Array<string | number> = error.message.split(' ');

      const code = messageArray.pop();

      if (code && Reflect.has(HTTPStatusCodeMessage, code)) {
        message
          .error(HTTPStatusCodeMessage[code as keyof typeof HTTPStatusCodeMessage])
          .then(() => void 0);
      } else if (code === 'exceeded') {
        message.error('请求超时，请稍后再试').then(() => void 0);
      }
    } else if (error?.constructor?.name === 'Cancel') {
      message.error('取消请求').then(() => void 0);
    }

    return Promise.reject(error);
  },
);

export interface BackEndData {
  code: number;
  data: any;
  msg: string;
}

export type RequestBackEndData = Promise<BackEndData>;

export const requestGet = (
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
): RequestBackEndData => {
  return serviceInstance.get(url, {
    ...config,
    params,
  });
};

export const requestPost = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): RequestBackEndData => {
  return serviceInstance.post(url, data, config);
};

export const requestDelete = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): RequestBackEndData => {
  return serviceInstance.delete(url, {
    ...config,
    data,
  });
};

export const requestPut = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): RequestBackEndData => {
  return serviceInstance.put(url, data, config);
};

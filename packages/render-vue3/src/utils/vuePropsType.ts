import {
  booleanType,
  dataPathType,
  functionType,
  numberType,
  objectType,
  stringType,
} from '@formlogic/render-core-vue3';
import { ExtractPropTypes } from 'vue';

import { RequestConfig } from '@/utils/request';

export const getApiConfigPropsType = () => {
  return {
    defaultPage: numberType(1),
    defaultPageSize: numberType(30),
    apiConfig: objectType<RequestConfig>(),
    remoteDataPath: dataPathType(),
    transformDataSource: functionType<(dataSource: any[]) => any[]>(),
    transformApiConfig: functionType<(config: RequestConfig) => RequestConfig>(),
    hasPagination: booleanType(false),
    labelTemplateKey: stringType(),
    valueTemplateKey: stringType(),
  };
};

export type ApiConfigPropsType = ExtractPropTypes<ReturnType<typeof getApiConfigPropsType>>;

import { ExtractPropTypes } from 'vue';

import {
  arrayType,
  booleanType,
  dataPathType,
  functionType,
  numberType,
  objectType,
  stringType,
} from '@/utils';

export const getSelectProps = () => {
  return {
    value: {
      type: [String, Number, Boolean, Array],
    },
    apiType: {
      type: String,
      default: '',
    },
    hasZeroPagination: {
      type: Boolean,
      default: false,
    },
    // 是否使用分页接口
    isPageApi: {
      type: Boolean,
      default: false,
    },
    multiple: booleanType(false),
    clearable: booleanType(true),
    filterable: booleanType(true),
    dataSource: arrayType([]),
    defaultOptions: arrayType([]),
    pageSize: numberType(),
    apiConfig: objectType<any>({}),
    remoteDataPath: dataPathType(),
    /**
     * @description 转换数据结果集
     */
    transformDataSource: functionType<(dataSource: any[]) => any[]>(),
    transformApiConfig: functionType<(config: any) => any>(),
    valueTemplateKey: stringType(),
    labelTemplateKey: stringType(),
    filterData: arrayType<string[]>([]),
    includeData: arrayType<string[]>([]),
    hasExactQuery: booleanType(false),
    hasExactQueryParamArray: booleanType(false),
    exactQueryParamKey: stringType<string>('id'),
    keywordKey: stringType<string>('code'),
    defaultPage: numberType(1),
    defaultPageSize: numberType(30),
    indent: numberType(0.25),
    getSelectOptionProps: functionType<(record: Record<string, any>) => Record<string, any>>(),
  };
};

export type SelectProps = ExtractPropTypes<ReturnType<typeof getSelectProps>>;

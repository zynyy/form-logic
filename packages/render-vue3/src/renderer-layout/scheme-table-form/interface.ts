import {
  ISchema,
  arrayType,
  booleanType,
  makeRequiredProp,
  numberType,
  stringType,
} from '@formlogic/render-core-vue3';

import { omit } from 'lodash-es';
import { ExtractPropTypes, PropType } from 'vue';

import { StrNumBool } from '@/interface';
import { getBasicSchemaProps } from '@/renderer-layout/interface';

export const getSchemeTableFormProps = () => {
  return {
    ...omit(getBasicSchemaProps(), ['getLogicConfig', 'extraLogicParams']),
    schema: makeRequiredProp<PropType<ISchema>>(Object),
    language: stringType<string>('zh-CN'),
    loading: booleanType(false),
    tableLoading: booleanType(false),
    hasRowSelection: {
      type: [Boolean, Number, String] as PropType<StrNumBool>,
    },
    hasClearSelectedRows: booleanType(true),
    scrollY: numberType(),
    rowKey: stringType(),
    selectedRows: arrayType<any>([]),
    dataSource: arrayType<any>([]),
    currentPage: numberType(),
    total: numberType(),
    pageSize: numberType(),
    hasPagination: booleanType(true),
    title: stringType(),
    hasMasterDetail: booleanType(),
    hasSideBar: booleanType(true),
    childRowKey: stringType(),
    hideOnSinglePage: booleanType(false),
  };
};

export type SchemeTableFormProps = ExtractPropTypes<ReturnType<typeof getSchemeTableFormProps>>;

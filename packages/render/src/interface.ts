import { SchemaTypes } from '@formily/json-schema';

import effectHook from '@/effect-hook';

export type SchemaMode = 'EDITABLE' | 'DETAIL' | 'DISABLED';

export type MetaDataType = keyof typeof MetaDataTypeEnum;

export type StrNumBool = '0' | '1' | 1 | 0 | boolean | undefined | null;

export type LogicConfig = (code: string) => Promise<any>;

export type EffectHook = keyof typeof effectHook | 'onClick';

export type EffectHookItem = {
  [L in EffectHook]?: string[];
};

export interface BtnFieldsItem {
  filed: string;
  clickCodes: string[];
  eventCode: string;
}

export type LogicListItem = {
  filed: string;
  logicHooks: EffectHookItem;
};

export enum MetaDataTypeEnum {
  column = 'column',
  table_column = 'table_column',
  search_column = 'search_column',
  button = 'button',
  table_button = 'table_button',
  search_button = 'search_button',
}

export interface MetaSchemaGroup {
  code: string; // 分组编码
  name: string; // 分组名称
  hiddenName?: boolean; // 是否隐藏名称
  component?: string; // 组件
  hasTabs?: StrNumBool;
  tabs?: string[];
  hasStep?: StrNumBool;
  steps?: string[];
  componentProps?: {
    // 组件属性
    [key: string]: any;
  };
}

export interface MetaLogic {
  event: EffectHook;
  logicCode: string;
}

export interface MetaSchemaData {
  code: string; // 字段
  name: string; // 字段名称
  type: MetaDataType; // 字段类型
  schemaType: SchemaTypes; // 字段值类型
  group?: string; // 所属分组
  hiddenName?: StrNumBool; // 是否隐藏名称 1 是 0 否
  disabled?: StrNumBool; // 是否禁止
  required?: StrNumBool; // 是否必填
  hidden?: StrNumBool; // 是否隐藏字段
  hasSerialNo?: StrNumBool; // 是否需要显示序号
  hasSort?: StrNumBool; // 是否需要拖动排序
  description?: string; // 字段补充描述
  eventCode?: string; // 自定义按钮事件
  colSpan?: number; // 跨列
  wrap?: StrNumBool; // 是否换行
  labelCol?: number; // 名称占比宽度
  wrapperCol?: number; // 组件占比宽度
  defaultValue?: any; // 默认值
  component?: string; // 组件
  logics?: MetaLogic[];
  componentProps?: {
    // 组件属性
    [key: string]: any;
  };
  validator?: {
    // 组件验证器
    [key: string]: any;
  };
  itemMetaSchema?: MetaSchema;
}

export interface MetaSchema {
  code: string;
  name: string;
  model: string;
  columnLayout?: number; // 几列布局
  defaultSearchColumn?: number; // 默认搜索数量
  labelCol?: number | undefined;
  wrapperCol?: number | undefined;
  remark?: string;
  group?: MetaSchemaGroup[];
  data: MetaSchemaData[];
}

export interface AnyObject {
  [key: string]: any;
}

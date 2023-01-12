import { SchemaTypes } from '@formily/react';
import { MouseEvent, RefObject } from 'react';

import effectHook from '@/effect-hook';

import { Field, Form } from '@formily/core';
import { STEPS_GROUP_MODE, TABS_GROUP_MODE } from '@/utils/constant';

export enum RequestMethodEnum {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
}

export enum SchemaPatternEnum {
  EDITABLE = 'EDITABLE',
  DETAIL = 'DETAIL',
  DISABLED = 'DISABLED',
}

export type SchemaPattern = keyof typeof SchemaPatternEnum;

export enum MetaDataTypeEnum {
  column = 'column',
  table_column = 'table_column',
  search_column = 'search_column',
  button = 'button',
  table_button = 'table_button',
  search_button = 'search_button',
  container = 'container',
}

export enum ComponentTypeEnum {
  container = 'container',
  button = 'button',
  array = 'array',
  object = 'object',
  string = 'string',
}

export type ComponentType = keyof typeof ComponentTypeEnum;

export enum SchemaTypeEnum {
  string = 'string',
  object = 'object',
  array = 'array',
  void = 'void',
}

export interface ApiConfig {
  method: 'post' | 'get';
  url: string;
  params: any;
}

export type MetaDataType = keyof typeof MetaDataTypeEnum;

export type StrNumBool = '0' | '1' | 1 | 0 | boolean | undefined | null;

export type LogicConfig = (code: string) => Promise<any>;

export type EffectHook = keyof typeof effectHook | 'onClick';

export type EffectHookItem = {
  [L in EffectHook]?: string[];
};

export interface BtnFieldsItem {
  fieldCode: string;
  clickCodes: string[];
  eventCode: string;
  pageCode: string;
  type: MetaDataType;
}

export interface EventsObject {
  [key: string]: (e: MouseEvent<HTMLElement>, ...args: any) => void;
}

export type LogicListItem = {
  fieldCode: string;
  logicHooks: EffectHookItem;
  pageCode: string;
  type: MetaDataType;
};

export interface MetaSchemaGroup {
  code: string; // 分组编码
  name: string; // 分组名称
  hiddenName?: boolean; // 是否隐藏名称
  component?: string; // 组件
  mode?: typeof TABS_GROUP_MODE | typeof STEPS_GROUP_MODE;
  modeCodes?: string[];
  componentProps?: {
    // 组件属性
    [key: string]: any;
  };
}

export interface MetaLogic {
  effectHook: EffectHook;
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
  parentCode?: string; // 上一级编码
  pageCode?: string; // 子编码
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

export interface ExecLogicListItem {
  formId: string;
  effectHook: EffectHook;
  pageCode: string;
  fieldCode: string;
  logicCode: string;
  time: number;
  createTime: string;
  doneTime: string;
  uid: string;
}

export interface LogicPayloadArgs {
  form: Form;
  fieldCode: string;
  effectHook: EffectHook;
  pageCode: string;
  [key: string]: any;
}

export type ExecInfo = Pick<LogicPayloadArgs, 'fieldCode' | 'effectHook' | 'pageCode'> & {
  logicCode: string;
  currentExecNum: number;
  execKey: string;
  execNumRef: RefObject<{
    [key: string]: number;
  }>;
};

export interface LogicCtxArgs {
  currentNode: {
    id: string;
    shape: string;
    data: AnyObject;
  };
  lastResult: AnyObject;
  payload: {
    form: Form;
    field?: Field;
    params?: AnyObject;
  };
  execInfo: ExecInfo;
}

export type NextLogicNodeArgs = (nextEdge?: string | number, prevNodeValue?: any) => void;

export type DataIndex = string | number | readonly (string | number)[];

export interface ConstantDataItem {
  code?: string;
  name: string;
  key?: string;
  options?: ConstantDataItem[];
}

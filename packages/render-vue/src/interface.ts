

import effectHook from '@/effect-hook';

import {Field, FieldFeedbackTriggerTypes, Form} from '@formily/core';
import { STEPS_GROUP_MODE, TABS_GROUP_MODE } from '@/utils/constant';
import { VueComponent } from '@/formily-vue';
import { SchemaTypes } from '@formily/json-schema';
import {Ref} from "vue";

export interface Components {
  [component: string]: VueComponent;
}

export enum CustomButtonMode {
  icon = 'icon',
  text = 'text',
}

export type CustomButtonModeType = keyof typeof CustomButtonMode;

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
  [key: string]: (e: MouseEvent, ...args: any) => void;
}

export type LogicListItem = {
  fieldCode: string;
  logicHooks: EffectHookItem;
  pageCode: string;
  type: MetaDataType;
};

export interface MetaSchemaGroup {
  code: string; // ????????????
  name: string; // ????????????
  hiddenName?: boolean; // ??????????????????
  component?: string; // ??????
  mode?: typeof TABS_GROUP_MODE | typeof STEPS_GROUP_MODE;
  modeCodes?: string[];
  componentProps?: {
    // ????????????
    [key: string]: any;
  };
}

export interface MetaLogic {
  effectHook: EffectHook;
  logicCode: string;
  hasChildren?: StrNumBool;
}

export interface ValidateRules {
  validatorRule: string;
  validatorRuleValue?: string;
  triggerType?: FieldFeedbackTriggerTypes
}

export interface MetaSchemaData {
  code: string; // ??????
  name: string; // ????????????
  type: MetaDataType; // ????????????
  schemaType: SchemaTypes; // ???????????????
  group?: string; // ????????????
  hiddenName?: StrNumBool; // ?????????????????? 1 ??? 0 ???
  disabled?: StrNumBool; // ????????????
  required?: StrNumBool; // ????????????
  hidden?: StrNumBool; // ??????????????????
  hasSerialNo?: StrNumBool; // ????????????????????????
  hasSort?: StrNumBool; // ????????????????????????
  description?: string; // ??????????????????
  eventCode?: string; // ?????????????????????
  colSpan?: number; // ??????
  wrap?: StrNumBool; // ????????????
  labelCol?: number; // ??????????????????
  wrapperCol?: number; // ??????????????????
  defaultValue?: any; // ?????????
  component?: string; // ??????
  parentCode?: string; // ???????????????
  pageCode?: string; // ?????????
  logics?: MetaLogic[];
  componentProps?: {
    // ????????????
    [key: string]: any;
  };
  validator?: ValidateRules[];
  itemMetaSchema?: MetaSchema;
}

export interface MetaSchema {
  code: string;
  name: string;
  model: string;
  columnLayout?: number; // ????????????
  defaultSearchColumn?: number; // ??????????????????
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
  field?: Field;
  [key: string]: any;
}

export type ExecInfo = Pick<LogicPayloadArgs, 'fieldCode' | 'effectHook' | 'pageCode'> & {
  logicCode: string;
  currentExecNum: number;
  execKey: string;
  clearExecNum: () => void;
  execNumRef: Ref<{
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

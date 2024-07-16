import {
  Field,
  FieldFeedbackTriggerTypes,
  Form,
  GeneralField,
  SchemaTypes,
  VueComponent,
} from '@formlogic/render-core-vue3';
import * as CSS from 'csstype';
import { PropType, Ref } from 'vue';

import effectHook from '@/effect-hook';
import {
  ComponentTypeEnum,
  MetaDataTypeEnum,
  RequestMethodEnum,
  STEPS_GROUP_MODE,
  TABS_GROUP_MODE,
} from '@/utils/constant';

export interface Components {
  [component: string]: VueComponent;
}

export enum CustomButtonMode {
  icon = 'icon',
  text = 'text',
}

export type CustomButtonModeType = keyof typeof CustomButtonMode;

export type RequestMethodType = keyof typeof RequestMethodEnum;

export type ComponentType = keyof typeof ComponentTypeEnum;

export interface ApiConfig {
  method: RequestMethodType;
  url: string;
  params: any;
}

export interface ApiPagination {
  method: RequestMethodType;
  url: string;
  params: any;
  data: any;
}

export type MetaDataType = keyof typeof MetaDataTypeEnum;

export type StrNumBool = '0' | '1' | 1 | 0 | boolean | undefined | null;

export type LogicConfig = (code: string) => any;

export type EffectHook = keyof typeof effectHook | 'onClick';

export type EffectHookItem = {
  [L in EffectHook]?: string[];
};

export interface BtnFieldsItem {
  fieldCode: string;
  clickCodes: string[];
  pageCode: string;
  type: MetaDataType;
  params?: Record<string, any>;
}

export type LogicListItem = {
  fieldCode: string;
  logicHooks: EffectHookItem;
  pageCode: string;
  type: MetaDataType;
  params?: Record<string, any>;
};

export interface MetaSchemaGroup {
  code: string; // 分组编码
  name: string; // 分组名称
  authCode?: string; // 权限编码
  hiddenName?: boolean; // 是否隐藏名称
  component?: string; // 组件
  mode?: typeof TABS_GROUP_MODE | typeof STEPS_GROUP_MODE;
  modeCodes?: string[];
  componentProps?: {
    // 组件属性
    [key: string]: any;
  };
  logics?: MetaLogic[]; // 页面逻辑
  hidden: boolean;
  originCode?: string; // 因不支持.命名的字段所以会把.改成-
}

export interface MetaLogic {
  effectHook: EffectHook;
  logicCode: string;
  hasChildren?: StrNumBool;
  params?: Record<any, any>;
}

export interface ValidateRules {
  validatorRule: string;
  validatorRuleValue?: any;
  triggerType?: FieldFeedbackTriggerTypes;
  message?: string;
}

export interface MetaSchemaData {
  code: string; // 字段
  originCode?: string; // 因不支持.命名的字段所以会把.改成-
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
  colSpan?: number; // 跨列
  wrap?: StrNumBool; // 是否换行
  labelCol?: number; // 名称占比宽度
  wrapperCol?: number; // 组件占比宽度
  defaultValue?: any; // 默认值
  component?: string; // 组件
  parentCode?: string; // 上一级编码
  slotName?: string;
  logics?: MetaLogic[]; // 页面逻辑
  authCode?: string; // 权限编码
  componentProps?: {
    [key: string]: any;
  }; // 组件属性
  validator?: ValidateRules[]; // 字段校验
  pageCode?: string; // 页面编码使用场景是当 schemaType 是 object 或者 array 时如果无法配置出来进行拆分配置。
  itemMetaSchema?: MetaSchema; // 使用场景是当 schemaType 是 object 或者 array 他们子项的数据集合
  agDetailMetaSchema?: MetaSchema; // 使用场景是当 schemaType ag 表格详情页
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
  layoutComponent?: string;
  layoutComponentProps?: Record<string, any>;
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
  field?: GeneralField;
  logicParams?: Record<string, any>;
  extraLogicParams?: Record<string, any>;
  clickParams?: Record<string, any>;
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

export interface CSSMotionProps {
  name?: string;
  css?: boolean;
  [key: string]: any;
}

export type Data = Record<string, unknown>;

export type Key = string | number;

type DefaultFactory<T> = (props: Data) => T | null | undefined;

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null;
  required?: boolean;
  default?: D | DefaultFactory<D> | null | undefined | object;
  validator?(value: unknown): boolean;
}

export type ElProps = Record<string, any>;
export type ElComponent = Record<string, any>;

export interface CSSProperties
  extends CSS.Properties<string | number>,
    CSS.PropertiesHyphen<string | number> {
  /**
   * The index signature was removed to enable closed typing for style
   * using CSSType. You're able to use type assertion or module augmentation
   * to add properties or an index signature of your own.
   *
   * For examples and more information, visit:
   * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
  [v: `--${string}`]: string | number | undefined;
}

export type PaginationType = {
  pageSize: number;
  current: number;
  total: number;
};

export type TransformDataSource = (dataSource: any[]) => any[];

export type LogicArgs<
  ExtraLogicParams = Record<string, any>,
  LogicParams = Record<string, any>,
  ClickParams = Record<string, any>,
> = {
  pageCode: string;
  fieldCode: string;
  effectHook: string;
  logicCode: string;
  execKey: string;
  clearExecNum: () => void;
  execNumIsEqual: () => boolean;
  callback: () => void;
  field?: GeneralField;
  form: Form;
  extraLogicParams?: ExtraLogicParams;
  logicParams?: LogicParams;
  clickParams?: ClickParams;
};

export type Direction = 'vertical' | 'horizontal';

export type LogicConfigFn = (pageCode: string) => ((args: LogicArgs) => void) | undefined;

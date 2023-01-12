

export interface AnyObject {
  [key: string]: any;
}

export interface LogicProcessConfig {
  name?: string;
  code?: string;
  belongCode?: string;
  detailAction?: string;
  updateAction?: string;
}

export interface PageDataSourceItem {
  code: string;
  name: string;
  type: string;
}

export interface LogicItem {
  fieldCode: string;
  fieldType: string;
  effectHook: string;
  logicCode: string;
}

export interface LogicProcessItem {
  code: string;
  name: string;
}

export interface EffectHookDataItem {
  code?: string;
  name: string;
  key?: string;
  options?: EffectHookDataItem[];
}

export interface CreateOptionsArgs {
  defaultEffectHook?: string;
}

export enum ChartPattern {
  EDITABLE = 'EDITABLE',
  DETAIL = 'DETAIL',
}

export type ChartPatternType = keyof typeof ChartPattern;

export interface ApiConfig {
  method: 'post' | 'get';
  url: string;
  params: any;
}

export type DataIndex = string | number | readonly (string | number)[];

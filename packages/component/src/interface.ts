import { FC, RefAttributes } from 'react';
import { Monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';

export type FCRef<Props, Ref> = FC<Props & RefAttributes<Ref>>;

export type StrNumBool = '0' | '1' | 1 | 0 | boolean | undefined | null;

export type MonacoType = typeof monacoEditor;

export type { editor as MonacoEditorType } from 'monaco-editor';

export enum CustomButtonMode {
  icon = 'icon',
  text = 'text',
}

export type CustomButtonModeType = keyof typeof CustomButtonMode;

export interface MonacoEditorLoaderPaths {
  vs: string;
}

export interface MonacoEditorLoaderConfig {
  paths?: {
    vs?: string;
  };
  'vs/nls'?: {
    availableLanguages?: object;
  };
  monaco?: Monaco;
}

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

export type DataIndex = string | number | Array<string | number>;

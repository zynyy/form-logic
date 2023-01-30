import mustache from 'mustache';
import { DataIndex, MonacoEditorLoaderPaths, StrNumBool } from '@/interface';
import { MONACO_EDITOR_PATHS_VS } from '@/utils/constant';
import { loader } from '@monaco-editor/react';

export * from './tree';

export let COMPONENT_PREFIX_CLS = 'form-logic';

export const DEFAULT_LOADER_CONFIG = {
  paths: {
    vs: MONACO_EDITOR_PATHS_VS,
  },
};

export const setMonacoEditorLoaderPath = (loaderPath: MonacoEditorLoaderPaths) => {
  DEFAULT_LOADER_CONFIG.paths = loaderPath;
  loader.config(DEFAULT_LOADER_CONFIG);
};

export const setComponentPrefixCls = (prefixCls: string) => {
  COMPONENT_PREFIX_CLS = prefixCls;
};

export const strNumBoolToBoolean = (val?: StrNumBool) => {
  return val === undefined ? false : Boolean(Number(val));
};

export const scaleFormatter = (scale: number): string => {
  return (scale * 100).toFixed(0) + '%';
};

export const arrayToNestJson = (arr: string[], value: any) => {
  const { length } = arr;
  let temp = {};
  let result: {
    [key: string]: any;
  } = {};
  const lastIndex = length - 1;
  let index = lastIndex;
  while (index >= 0) {
    const key = arr[index];
    result[key] = index === lastIndex ? value : temp;
    if (index > 0) {
      temp = result;
      result = {};
    }
    index = index - 1;
  }
  return result;
};

export const toArray = <T>(arr: T | readonly T[]): T[] => {
  if (arr === undefined || arr === null) {
    return [];
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[];
};

const HEX = 'zyxwvutsrqponmlkjihgfedcba9876543210';

export const uid = (len?: number) => {
  let str = '';
  let num = len || 6;

  while (num--) {
    str += HEX[(Math.random() * 36) | 0];
  }
  return str;
};

export const getPathValue = <ValueType, ObjectType extends object>(
  record: ObjectType,
  path?: DataIndex,
): ValueType | null => {
  // Skip if path is empty
  if (!path && typeof path !== 'number') {
    return record as unknown as ValueType;
  }

  const pathList = toArray(path);

  let current: ValueType | ObjectType = record;

  for (let i = 0; i < pathList.length; i += 1) {
    if (!current) {
      return null;
    }

    const prop = pathList[i];
    // @ts-ignore
    current = current[prop];
  }

  return current as ValueType;
};

export const transformToOptions = (
  data: any[],
  labelTemplateKey?: string,
  valueTemplateKey?: string,
): any[] => {
  return toArray(data).map((item: any) => {
    const { options } = item || {};
    const label = mustache.render(labelTemplateKey || '{{name}}', item);

    if (options?.length) {
      return {
        label,
        ...item,
        options: transformToOptions(options),
      };
    }
    const value = mustache.render(valueTemplateKey || '{{code}}', item);
    return {
      label,
      value,
      ...item,
    };
  });
};

export const getDateDefaultFormat = ({ picker, showTime }): string => {
  if (picker === 'month') {
    return 'YYYY-MM';
  } else if (picker === 'quarter') {
    return 'YYYY-Q';
  } else if (picker === 'year') {
    return 'YYYY';
  } else if (picker === 'week') {
    return 'GGGG-WW';
  }
  return showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
};

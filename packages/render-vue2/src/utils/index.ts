import { DataIndex } from '@formlogic/render-core-vue2';
import mustache from 'mustache';

export * from './jsonMetaSchema';
export { default as request, requestDelete, requestGet, requestPost, requestPut } from './request';
export * from './tree';
export * from './vuePropsType';

import { toArray } from '@formlogic/render-core-vue2';
import { get, isObject, isString } from 'lodash-es';

import { Key } from '@/interface';
import { isTemplateString } from '@/utils/is';
import whenParser from '@/utils/parser/whenParser';
import { escapeSequence } from '@/utils/xss';

export const getPathValue = <ValueType, ObjectType extends object>(
  record: ObjectType,
  path?: DataIndex,
): ValueType | null => {
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
    const { options, children } = item || {};

    let label = '';

    if (labelTemplateKey && isTemplateString(labelTemplateKey)) {
      label = mustache.render(labelTemplateKey, item);
    } else {
      label = labelTemplateKey ? item[labelTemplateKey] : item.name;
    }

    let value = '';

    if (valueTemplateKey && isTemplateString(valueTemplateKey)) {
      value = mustache.render(valueTemplateKey, item);
    } else {
      value = valueTemplateKey ? item[valueTemplateKey] : item.code;
    }

    if (options?.length) {
      return {
        ...item,
        label,
        value,
        options: transformToOptions(options, labelTemplateKey, valueTemplateKey),
      };
    }

    if (children?.length) {
      return {
        ...item,
        label,
        value,
        children: transformToOptions(children, labelTemplateKey, valueTemplateKey),
      };
    }

    return {
      ...item,
      label,
      value,
    };
  });
};

export const treeDataToFlatData = (treeData: any[]): any[] => {
  return toArray(treeData).reduce((acc: any, item) => {
    const { children, ...restData } = item;

    if (children) {
      return acc.concat({ ...restData }).concat(treeDataToFlatData(children));
    }
    return acc.concat({ ...restData });
  }, []);
};

export const treeDataToFlatDataLevel = (treeData: any[], level: number): any[] => {
  if (!Array.isArray(treeData)) {
    return [];
  }

  return treeData.reduce((acc, cur) => {
    const { children, ...restData } = cur;

    const nextLevel = level + 1;

    return acc
      .concat({
        ...restData,
        level,
      })
      .concat(treeDataToFlatDataLevel(children, nextLevel));
  }, []);
};

export const findMultiArray = <T = Record<string, any>>(
  multiArray: any[],
  findKey: string,
): T | undefined => {
  if (!Array.isArray(multiArray)) return undefined;

  const { length } = multiArray;

  let index = 0;

  while (index < length) {
    const item = multiArray[index];

    const { key, children } = item;

    if (key === findKey) {
      return item;
    }

    if (children?.length) {
      const findChildrenItem = findMultiArray<T>(children, findKey);
      if (findChildrenItem) {
        return findChildrenItem;
      }
    }

    index += 1;
  }

  return undefined;
};

export const getTreeParentKey = (key: Key, tree: any[]): Key | undefined => {
  let parentKey: Key | undefined = undefined;

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { key: Key }) => item.key === key)) {
        parentKey = node.key;
      } else {
        const nextKey = getTreeParentKey(key, node.children);
        if (nextKey) {
          parentKey = nextKey;
        }
      }
    }
  }
  return parentKey;
};

export const arrayToNestJson = (arr: string[], value: any) => {
  const { length } = arr;
  let temp = {};
  let result: Record<string, any> = {};
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

export const nowTime = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const time = date.getTime();

  return {
    time,
    timeFormat: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
  };
};

export const replacePx = (val: string) => {
  return val.replace('px', '');
};

export const transformPath = (path: DataIndex): Array<string | number> => {
  if (Array.isArray(path)) {
    return path;
  }

  if (typeof path === 'number') {
    return [path];
  }

  if (path && typeof path === 'string') {
    return path?.split('.');
  }

  return ['data'];
};

export const getPathData = (tplPath: any, record: Record<string, any>) => {
  if (isString(tplPath)) {
    return get(record, tplPath) ?? tplPath;
  }

  if (isObject(tplPath)) {
    const nextConfig: Record<string, any> = {};
    Object.keys(tplPath).forEach((key) => {
      const val = (tplPath as Record<string, any>)[key];
      nextConfig[key] = getPathData(val, record);
    });

    return nextConfig;
  }

  return tplPath;
};

mustache.Writer.prototype.escapedValue = function escapedValue(token, context, config) {
  const value = context.lookup(token[1]);

  if (!value && value !== 0) {
    return "''";
  }

  return String(value);
};

export const compileTpl = (tpl: any, record: Record<string, any>): any => {
  if (isString(tpl)) {
    const view = {
      ...record,
      trimComma: () => {
        return (text: string, render: any) => {
          return render(text).replace(/(,\s*$)/g, '');
        };
      },
      exp: () => {
        return (text: string) => {
          return whenParser(text, view);
        };
      },
    };

    return isTemplateString(tpl) ? mustache.render(tpl, view)?.replaceAll("''''", "''") : tpl;
  }

  if (Array.isArray(tpl)) {
    if (tpl.length === 1) {
      const str = tpl[0];
      if (str && str.includes('.')) {
        const [arr, key] = str.split('.');
        const data = record[arr];
        if (Array.isArray(data)) {
          return (
            data
              .map((item: Record<string, any>) => {
                return item[key];
              })
              .filter((val: any) => val) || []
          );
        }
      }
      return [compileTpl(str, record)].filter((val) => val || val === 0);
    } else {
      return tpl
        .map((item) => {
          return compileTpl(item, record);
        })
        .filter((val) => val || val === 0);
    }
  }

  if (isObject(tpl)) {
    const nextConfig: Record<string, any> = {};
    Object.keys(tpl).forEach((key) => {
      const val = (tpl as Record<string, any>)[key];
      nextConfig[key] = compileTpl(val, record);
    });

    return nextConfig;
  }

  return tpl;
};

export const composeExport = <T0 extends {}, T1 extends {}>(s0: T0, s1: T1): T0 & T1 => {
  return Object.assign(s0, s1);
};

export const highlightLabel = (label: string, highlight: string): string => {
  if (!highlight) {
    return escapeSequence(label);
  }
  return escapeSequence(label).replaceAll(
    highlight,
    `<span style="color: #0065d9;">${highlight}</span>`,
  );
};

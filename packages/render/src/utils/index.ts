import { DataIndex } from '@/interface';

import mustache from 'mustache';
import { Key } from 'react';
import type { DataNode } from 'antd/es/tree';

export const toArray = <T>(arr: T | readonly T[]): T[] => {
  if (arr === undefined || arr === null) {
    return [];
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[];
};

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

export const treeDataToFlatData = (treeData: DataNode[]): any[] => {
  return toArray(treeData).reduce((acc: any, item) => {
    const { children, ...restData } = item;

    if (children) {
      return acc.concat({ ...restData }).concat(treeDataToFlatData(children));
    }
    return acc.concat({ ...restData });
  }, []);
};

export const findMultiArray = (multiArray, findKey) => {
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
      const findChildrenItem = findMultiArray(children, findKey);
      if (findChildrenItem) {
        return findChildrenItem;
      }
    }

    index += 1;
  }

  return undefined;
};

export const getTreeParentKey = (key: Key, tree: DataNode[]): Key => {
  let parentKey: Key;

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
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
  let result = {};
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

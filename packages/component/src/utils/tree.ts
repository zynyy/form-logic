import { Key } from 'react';
import { DataNode } from 'antd/es/tree';
import { toArray } from '@/utils';

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

export const treeDataToFlatData = (treeData: DataNode[]): any[] => {
  return toArray(treeData).reduce((acc: any, item) => {
    const { children, ...restData } = item;

    if (children) {
      return acc.concat({ ...restData }).concat(treeDataToFlatData(children));
    }
    return acc.concat({ ...restData });
  }, []);
};

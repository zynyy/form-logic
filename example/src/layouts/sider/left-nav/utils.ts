import { Key, ReactNode } from 'react';
import { MenuProps } from 'antd';
import { pathToRegexp } from 'path-to-regexp';
import { compareSimilarity } from '@/utils/utils';

type MenuItem = Required<MenuProps>['items'][number];

export const flatMenuChildren = (data, curItem?:any) => {
  if (!data.length) {
    return [];
  }

  const flatMenu = [];

  data.forEach((item) => {
    const { children, ...rest } = item;

    flatMenu.push({
      ...rest,
      parentPath: curItem?.path,
    });
    if (children && children.length) {
      flatMenu.push(...flatMenuChildren(children, item));
    }
  });

  return flatMenu;
};

export const recursionChildren = (item, childrenData) => {
  const { id: key } = item;

  const children = childrenData[key];

  if (!Array.isArray(children)) {
    return [];
  }

  return children.map((current) => {
    const { name, icon, path, parentPath, id } = current;

    return {
      name,
      icon,
      path,
      parentPath,
      id,
      children: recursionChildren(current, childrenData),
    };
  });
};

export const getItem = (
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
};

export const getMenuMatches = (flatMenu, path) => {
  return flatMenu
    .filter((item) => {
      if (item.path === '/' && path === '/') {
        return true;
      }
      if (item && item.path !== '/') {
        // /a
        if (pathToRegexp(`${item.path}`).test(path)) {
          return true;
        }
        // /a/b/b
        if (pathToRegexp(`${item.path}(.*)`).test(path)) {
          return true;
        }
      }
      return false;
    })
    .map((item) => ({
      ...item,
      weight: compareSimilarity(item.path, path),
    }))
    .sort((a, b) => {
      if (a.weight > b.weight) {
        return -1;
      }
      if (a.weight < b.weight) {
        return 1;
      }
      return 0;
    })
    .pop();
};

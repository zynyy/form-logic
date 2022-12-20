import { isUrl } from '@/utils/is';
import { Layout, Menu, MenuProps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import React, { useEffect, useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  flatMenuChildren,
  getItem,
  getMenuMatches,
  recursionChildren,
} from '@/layouts/sider/left-nav/utils';
import { Helmet } from 'react-helmet-async';

const { Sider } = Layout;

const LeftNavSider = () => {
  const [openKeys, setOpenKeys] = useState([]);
  const [menus, setMenus] = useState([]);
  const [flatMenus, setFlatMenus] = useState([]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  const { pathname } = useLocation();


  const [title, setTitle] = useState('菜单栏');

  const [selectedKeys, setSelectedKeys] = useState([]);

  const getLabel = (item) => {
    const { path, children, name } = item || {};

    if (isUrl(path)) {
      return (
        <a target="_blank" href={path} rel="noreferrer">
          <span>{name}</span>
        </a>
      );
    }

    if (children && children.length) {
      return <span>{name}</span>;
    }

    return (
      <Link to={path}>
        <span>{name}</span>
      </Link>
    );
  };

  const generateMenus = (menusConfig: any) => {
    if (!menusConfig) {
      return [];
    }
    return menusConfig.map((item) => {
      const { children, path } = item || {};

      return getItem(
        getLabel(item),
        path,
        <SettingOutlined />,
        children && children.length ? generateMenus(children) : null,
      );
    });
  };

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));

    if (!rootSubmenuKeys.includes(latestOpenKey)) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  useEffect(() => {
    const { menus } = {
      menus: [
        {
          name: '系统管理',
          path: '/setting',
          id: '1',
        },
        {
          name: '菜单',
          path: '/setting/menu',
          pid: '1',
          id: '1-1',
        },
        {
          name: '数据管理',
          path: '/development',
          id: '3',
        },
        {
          name: '元数据',
          path: '/development/meta',

          id: '3-1',
          pid: '3',
        },
        {
          name: '模型',
          path: '/development/model',

          id: '3-2',
          pid: '3',
        },
        {
          name: '页面配置',
          path: '/development/page-config',
          id: '3-3',
          pid: '3',
        },
        {
          name: '逻辑流程',
          path: '/development/logic',
          id: '3-4',
          pid: '3',
        },
        {
          name: 'UI组件',
          path: '/development/component',
          id: '3-5',
          pid: '3',
        },

        {
          name: '客户管理',
          path: '/client',
          pid: '2',
        },
      ],
    };

    const subMenu = [];

    const subMenuChildren = {};

    menus.forEach((item) => {
      const { pid } = item;
      if (!pid) {
        subMenu.push(item);
      } else if (Reflect.has(subMenuChildren, pid)) {
        subMenuChildren[pid] = subMenuChildren[pid].concat(item);
      } else {
        subMenuChildren[pid] = [item];
      }
    });

    const menusConfig = subMenu.map((item) => {
      const { name, icon, id, path } = item;
      return {
        name,
        icon,
        path,
        id,
        children: recursionChildren(item, subMenuChildren),
      };
    });

    setMenus(generateMenus(menusConfig));

    setRootSubmenuKeys(menusConfig.map((item) => item.path));

    const flats = flatMenuChildren(menusConfig, {});

    setFlatMenus(flats);
  }, []);

  useEffect(() => {
    const { path, parentPath, name } = getMenuMatches(flatMenus, pathname) || {};

    const animationFrameId = requestAnimationFrame(() => {
      setOpenKeys(parentPath ? [parentPath] : []);

      setSelectedKeys(path ? [path] : []);

      setTitle(name);

    });
    return () => window.cancelAnimationFrame && window.cancelAnimationFrame(animationFrameId);
  }, [pathname, flatMenus]);

  return (
    <Sider width={160} collapsible trigger={null} collapsed={false}>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        inlineIndent={15}
        items={menus}
        style={{
          height: '100%',
        }}
      />
      <Helmet>
        <title>{title}</title>
      </Helmet>
    </Sider>
  );
};

export default memo(LeftNavSider);

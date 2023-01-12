import { TreeProps, Input, Tree } from 'antd';

import { DownOutlined } from '@ant-design/icons';
import { ChangeEvent, FC, Key, useMemo, useState } from 'react';

import type { DataNode } from 'antd/es/tree';
import { getTreeParentKey, treeDataToFlatData } from '@/utils';
import { useStaticSearchTreeStyle } from './hooks';
import cls from 'classnames';

const { Search } = Input;

export interface StaticSearchTreeProps extends TreeProps {}

const StaticSearchTree: FC<StaticSearchTreeProps> = ({ treeData, ...restProps }) => {
  const [searchValue, setSearchValue] = useState('');

  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [warpSSR, hashId, prefixCls] = useStaticSearchTreeStyle();

  const flatData = useMemo(() => {
    return treeDataToFlatData(treeData);
  }, [treeData]);

  const treeDataSource = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span
                className={cls(hashId, {
                  [`${prefixCls}-search-value`]: true,
                })}
              >
                {searchValue}
              </span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { ...item, title, key: item.key, children: loop(item.children) };
        }

        return {
          ...item,
          title,
          key: item.key,
        };
      });

    return loop(treeData);
  }, [searchValue, treeData]);

  const handleExpand = (newExpandedKeys: Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const newExpandedKeys = flatData
      .map((item) => {
        if (item.title.toString().indexOf(value) > -1) {
          return getTreeParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, data) => item && data.indexOf(item) === i);

    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  return warpSSR(
    <div className={cls(hashId, prefixCls)}>
      <Search style={{ marginBottom: 8 }} onChange={handleSearchChange} />
      <Tree
        showLine
        height={555}
        {...restProps}
        switcherIcon={<DownOutlined />}
        treeData={treeDataSource}
        blockNode
        autoExpandParent={autoExpandParent}
        onExpand={handleExpand}
        expandedKeys={expandedKeys}
      />
    </div>,
  );
};

export default StaticSearchTree;

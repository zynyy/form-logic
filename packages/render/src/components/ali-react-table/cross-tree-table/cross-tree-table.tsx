import React, { FC, useEffect, useState } from 'react';

import ArtTable, { ArtTableProps } from '../art-table';
import { CellProps } from '../interfaces';
import { CrossTableLeftMetaColumn, LeftCrossTreeNode, TopCrossTreeNode } from '../cross-table';
import buildCrossTreeTable from './buildCrossTreeTable';
import { ROW_KEY } from '@/components/ali-react-table/utils/constants';

export interface CrossTreeTableProps
  extends Omit<ArtTableProps, 'dataSource' | 'columns' | 'primaryKey'> {
  primaryColumn: CrossTableLeftMetaColumn;
  leftTree: LeftCrossTreeNode[];
  topTree: TopCrossTreeNode[];

  defaultOpenKeys?: string[];
  openKeys?: string[];
  onChangeOpenKeys?(nextOpenKeys: string[]): void;
  indentSize?: number;
  isLeafNode?(node: any, nodeMeta: { depth: number; expanded: boolean; rowKey: string }): boolean;

  getValue?(
    leftNode: LeftCrossTreeNode,
    topNode: TopCrossTreeNode,
    leftDepth: number,
    topDepth: number,
  ): any;
  render?(
    value: any,
    leftNode: LeftCrossTreeNode,
    topNode: TopCrossTreeNode,
    leftDepth: number,
    topDepth: number,
  ): React.ReactNode;
  getCellProps?(
    value: any,
    leftNode: LeftCrossTreeNode,
    topNode: TopCrossTreeNode,
    leftDepth: number,
    topDepth: number,
  ): CellProps;
}

const CrossTreeTable: FC<CrossTreeTableProps> = (props) => {
  const {
    leftTree,
    topTree,
    getValue,
    getCellProps,
    primaryColumn,
    render,

    openKeys: openKeysProp,
    defaultOpenKeys,
    onChangeOpenKeys,
    indentSize,
    isLeafNode,

    ...others // 透传其他 BaseTable 的 props
  } = props;

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleChangeOpenKeys = (nextOpenKeys: string[]) => {
    onChangeOpenKeys?.(nextOpenKeys);
    if (openKeysProp) {
      setOpenKeys(nextOpenKeys);
    }
  };

  useEffect(() => {
    setOpenKeys(openKeysProp ?? []);
  }, [openKeysProp]);

  const { dataSource, columns } = buildCrossTreeTable({
    leftTree,
    topTree,
    getValue,
    getCellProps,
    render,
    primaryColumn,
    openKeys,
    onChangeOpenKeys: handleChangeOpenKeys,
    indentSize,
    isLeafNode,
  });

  return <ArtTable {...others} primaryKey={ROW_KEY} dataSource={dataSource} columns={columns} />;
};

export default CrossTreeTable;

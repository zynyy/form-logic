import React, { FC } from 'react';
import ArtTable, { ArtTableProps } from '../art-table';
import { CellProps } from '../interfaces';
import buildCrossTable from './buildCrossTable';

import { CrossTableLeftMetaColumn, LeftCrossTreeNode, TopCrossTreeNode } from './interfaces';
import { ROW_KEY } from '@/components/ali-react-table/utils/constants';

export interface CrossTableProps extends Omit<ArtTableProps, 'dataSource' | 'columns' | 'primaryKey'> {
  leftTree: LeftCrossTreeNode[];
  topTree: TopCrossTreeNode[];

  leftTotalNode?: LeftCrossTreeNode;
  topTotalNode?: TopCrossTreeNode;
  leftMetaColumns?: CrossTableLeftMetaColumn[];

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

const CrossTable: FC<CrossTableProps> = ({
  leftTree,
  leftTotalNode,
  topTree,
  topTotalNode,
  getValue,
  getCellProps,
  leftMetaColumns,
  render,
  ...restProps
}) => {
  const { dataSource, columns } = buildCrossTable({
    leftTree,
    topTree,
    leftTotalNode,
    topTotalNode,
    getValue,
    getCellProps,
    render,
    leftMetaColumns,
  });

  return <ArtTable {...restProps} primaryKey={ROW_KEY} dataSource={dataSource} columns={columns} />;
};

export default CrossTable;

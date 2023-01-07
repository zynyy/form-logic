import React, { CSSProperties, ReactNode, SVGProps } from 'react';
import {
  HorizontalRenderRange,
  ResolvedUseVirtual,
  VerticalRenderRange,
  VirtualEnum,
  PrimaryKey,
  getRowProps,
} from '@/components/ali-react-table/art-table/interfaces';

export type ArtColumnAlign = 'left' | 'center' | 'right';

export type CellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export type UseVirtual =
  | VirtualEnum
  | { horizontal?: VirtualEnum; vertical?: VirtualEnum; header?: VirtualEnum };

export type getVerticalRenderRangeType = (useVirtual: ResolvedUseVirtual) => VerticalRenderRange;



export interface ArtColumnStaticPart {
  /** 列的名称 */
  name: string;

  /** 在数据中的字段 code */
  code?: string;

  /** 列标题的展示名称；在页面中进行展示时，该字段将覆盖 name 字段 */
  title?: ReactNode;

  /** 列的宽度，如果该列是锁定的，则宽度为必传项 */
  width?: number;

  /** 单元格中的文本或内容的 对其方向 */
  align?: ArtColumnAlign;

  /** @deprecated 是否隐藏 */
  hidden?: boolean;

  /** 是否锁列 */
  lock?: boolean;

  /** 表头单元格的 props */
  headerCellProps?: CellProps;

  /** 功能开关 */
  features?: { [key: string]: any };
}

export interface ArtColumnDynamicPart {
  /** 自定义取数方法 */
  getValue?(row: any, rowIndex: number): any;

  /** 自定义渲染方法 */
  render?(value: any, row: any, rowIndex: number): ReactNode;

  /** 自定义的获取单元格 props 的方法 */
  getCellProps?(value: any, row: any, rowIndex: number): CellProps;

  /** 自定义的获取单元格 SpanRect 方法 */
  getSpanRect?(value: any, row: any, rowIndex: number): SpanRect;
}

export interface ArtColumn extends ArtColumnStaticPart, ArtColumnDynamicPart {
  /** 该列的子节点 */
  children?: ArtColumn[];
}

/** SpanRect 用于描述合并单元格的边界
 * 注意 top/left 为 inclusive，而 bottom/right 为 exclusive */
export interface SpanRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type VisibleColumnDescriptor =
  | { type: 'blank'; blankSide: 'left' | 'right'; width: number }
  | { type: 'normal'; colIndex: number; col: ArtColumn };

export interface AbstractTreeNode {
  children?: AbstractTreeNode[];
}

export type SortOrder = 'desc' | 'asc' | 'none';

export type SortItem = { code: string; order: SortOrder };

export type Transform<T> = (input: T) => T;

export interface HoverRange {
  start: number;
  end: number;
}

export interface IconProps extends SVGProps<SVGElement> {
  height?: number;
  preserveAspectRatio?: string;
  title?: string;
  viewBox?: string;
  width?: number;
  xmlns?: string;
  ref?: any;
}

export interface RenderInfo {
  verticalRenderRange: VerticalRenderRange;
  horizontalRenderRange: HorizontalRenderRange;
  renderColumns: VisibleColumnDescriptor[];

  flat: { full: ArtColumn[]; left: ArtColumn[]; center: ArtColumn[]; right: ArtColumn[] };
  nested: { full: ArtColumn[]; left: ArtColumn[]; center: ArtColumn[]; right: ArtColumn[] };
  stickyLeftMap: Map<number, number>;
  stickyRightMap: Map<number, number>;
  resolvedUseVirtual: ResolvedUseVirtual;

  /** props.columns 是否包含有效的锁列 */
  hasLockColumn: boolean;
  /** 左侧锁定列的总宽度 */
  leftLockTotalWidth: number;
  /** 右侧锁定列的总宽度 */
  rightLockTotalWidth: number;
}

export interface HeaderRenderInfoArg
  extends Pick<RenderInfo, 'horizontalRenderRange' | 'flat' | 'nested'> {
  resolvedUseVirtual: ResolvedUseVirtual;
}

import { CSSProperties, HTMLAttributes } from 'react';
import { ArtColumn, UseVirtual } from '../interfaces';

export type VirtualEnum = false | true | 'auto';

export type getRowProps = (row: any, rowIndex: number) => HTMLAttributes<HTMLTableRowElement>;

export type PrimaryKey = string | ((row: any) => string);

export interface VerticalRenderRange {
  topIndex: number;
  topBlank: number;
  bottomIndex: number;
  bottomBlank: number;
}

export interface HorizontalRenderRange {
  leftIndex: number;
  leftBlank: number;
  rightIndex: number;
  rightBlank: number;
}

// VisibleColumnDescriptor 用于在表格内部描述「那些在页面中可见的列」
export type VisibleColumnDescriptor =
  | { type: 'blank'; blankSide: 'left' | 'right'; width: number }
  | { type: 'normal'; colIndex: number; col: ArtColumn };

export interface ResolvedUseVirtual {
  horizontal: boolean;
  vertical: boolean;
  header: boolean;
}

export interface RenderInfo {
  verticalRenderRange: VerticalRenderRange;
  horizontalRenderRange: HorizontalRenderRange;
  visible: VisibleColumnDescriptor[];

  flat: { full: ArtColumn[]; left: ArtColumn[]; center: ArtColumn[]; right: ArtColumn[] };
  nested: { full: ArtColumn[]; left: ArtColumn[]; center: ArtColumn[]; right: ArtColumn[] };
  stickyLeftMap: Map<number, number>;
  stickyRightMap: Map<number, number>;
  useVirtual: ResolvedUseVirtual;

  /** props.columns 是否包含有效的锁列 */
  hasLockColumn: boolean;
  /** 左侧锁定列的总宽度 */
  leftLockTotalWidth: number;
  /** 右侧锁定列的总宽度 */
  rightLockTotalWidth: number;
}

export interface BaseTableProps {
  /** 主键 */
  primaryKey?: PrimaryKey;
  /** 表格展示的数据源 */
  dataSource: any[];
  /** 表格页脚数据源 */
  footerDataSource?: any[];
  /** 表格的列配置 */
  columns: ArtColumn[];

  /** 是否开启虚拟滚动 */
  useVirtual?: UseVirtual;

  /** 虚拟滚动开启情况下，表格中每一行的预估高度 */
  estimatedRowHeight?: number;
  /** 表格头部是否置顶，默认为 true */
  isStickyHeader?: boolean;
  /** 表格置顶后，距离顶部的距离 */
  stickyTop?: number;
  /** 表格页脚是否置底，默认为 true */
  isStickyFooter?: boolean;
  /** 表格页脚置底后，距离底部的距离 */
  stickyBottom?: number;
  /** 自定义类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: CSSProperties;
  /** 表格是否具有头部 */
  hasHeader?: boolean;
  /** 表格是否具有横向的粘性滚动条 */
  hasStickyScroll?: boolean;
  /** 横向粘性滚动条高度 */
  stickyScrollHeight?: 'auto' | number;
  /** 使用来自外层 div 的边框代替单元格的外边框 */
  useOuterBorder?: boolean;

  /** 表格是否在加载中 */
  loading?: boolean;
  /** 数据为空时，单元格的高度 */
  emptyCellHeight?: number;

  /** 列的默认宽度 */
  defaultColumnWidth?: number;

  getRowProps?: getRowProps;
  virtualDebugLabel?: string;
}

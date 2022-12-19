import {
  ArtColumn,
  getVerticalRenderRangeType,
  HeaderRenderInfoArg,
  RenderInfo,
  UseVirtual,
  VisibleColumnDescriptor,
} from '../interfaces';
import { collectNodes, isLeafNode } from '../utils';

import {
  ResolvedUseVirtual,
  VirtualEnum,
  HorizontalRenderRange,
} from '@/components/ali-react-table/art-table/interfaces';
import { AUTO_VIRTUAL_THRESHOLD, OVER_SCAN_SIZE } from '@/components/ali-react-table/utils/constants';


export const sum = (arr: number[]) => {
  let result = 0;
  arr.forEach((x) => {
    result += x;
  });
  return result;
};

function resolveVirtualEnabled(virtualEnum: VirtualEnum, defaultValue: boolean) {
  if (virtualEnum == null || virtualEnum === 'auto') {
    return defaultValue;
  }
  return virtualEnum;
}

let lockColumnNeedSpecifiedWidthWarned = false;
function warnLockColumnNeedSpecifiedWidth(column: ArtColumn) {
  if (!lockColumnNeedSpecifiedWidthWarned) {
    lockColumnNeedSpecifiedWidthWarned = true;
    console.warn('[ali-react-art-table] lock=true 的列需要指定宽度', column);
  }
}

/** 检查列配置 & 设置默认宽度 & 剔除隐藏的列 */
function processColumns(columns: ArtColumn[], defaultColumnWidth: number) {
  if (columns == null || !Array.isArray(columns)) {
    console.warn('[ali-react-art-table] <BaseTable /> props.columns 需要传入一个数组', columns);
    columns = [];
  }

  function dfs(columns: ArtColumn[]): ArtColumn[] {
    const result: ArtColumn[] = [];

    for (let column of columns) {
      if (column.width == null) {
        if (defaultColumnWidth != null) {
          column = { ...column, width: defaultColumnWidth };
        } else if (process.env.NODE_ENV !== 'production' && isLeafNode(column) && column.lock) {
          warnLockColumnNeedSpecifiedWidth(column);
        }
      }

      if (isLeafNode(column)) {
        result.push(column);
      } else {
        const nextChildren = dfs(column.children);
        // 如果 nextChildren 为空，说明所有的子节点均被隐藏了，在这里隐藏父节点
        if (nextChildren.length > 0) {
          result.push({ ...column, children: nextChildren });
        }
      }
    }
    return result;
  }

  return dfs(columns);
}

function getLeftNestedLockCount(columns: ArtColumn[]) {
  let nestedCount = 0;

  for (const col of columns) {
    if (isLock(col)) {
      nestedCount += 1;
    } else {
      break;
    }
  }
  return nestedCount;

  function isLock(col: ArtColumn): boolean {
    if (isLeafNode(col)) {
      return col.lock;
    } else {
      return col.lock || col.children.some(isLock);
    }
  }
}

function getHorizontalRenderRange({
  offsetX,
  maxRenderWidth,
  flat,
  useVirtual,
}: {
  offsetX: number;
  maxRenderWidth: number;
  flat: RenderInfo['flat'];
  useVirtual: ResolvedUseVirtual;
}): HorizontalRenderRange {
  if (!useVirtual.horizontal) {
    return { leftIndex: 0, leftBlank: 0, rightIndex: flat.full.length, rightBlank: 0 };
  }

  let leftIndex = 0;
  let centerCount = 0;
  let leftBlank = 0;
  let centerRenderWidth = 0;

  const overscannedOffsetX = Math.max(0, offsetX - OVER_SCAN_SIZE);
  while (leftIndex < flat.center.length) {
    const col = flat.center[leftIndex];
    if (col.width + leftBlank < overscannedOffsetX) {
      leftIndex += 1;
      leftBlank += col.width;
    } else {
      break;
    }
  }

  // 考虑 over scan 之后，中间部分的列至少需要渲染的宽度
  const minCenterRenderWidth =
    maxRenderWidth + (overscannedOffsetX - leftBlank) + 2 * OVER_SCAN_SIZE;

  while (leftIndex + centerCount < flat.center.length) {
    const col = flat.center[leftIndex + centerCount];
    if (col.width + centerRenderWidth < minCenterRenderWidth) {
      centerRenderWidth += col.width;
      centerCount += 1;
    } else {
      break;
    }
  }

  const rightBlankCount = flat.center.length - leftIndex - centerCount;
  const rightBlank = sum(
    flat.center.slice(flat.center.length - rightBlankCount).map((col) => col.width),
  );
  return {
    leftIndex: leftIndex,
    leftBlank,
    rightIndex: leftIndex + centerCount,
    rightBlank,
  };
}

interface CalculateRenderInfoArgs {
  offsetX: number;
  maxRenderWidth: number;
  useVirtual: UseVirtual;
  columns;
  dataSource: any[];
  defaultColumnWidth: number;
  getVerticalRenderRange: getVerticalRenderRangeType;
}

// 一顿计算，将表格本次渲染所需要的数据都给算出来（代码写得有点乱，有较大优化空间）
// todo 可以考虑下将 header 部分的计算逻辑也放到这个文件中，目前应该有一些重复的计算逻辑
export function calculateRenderInfo(table: CalculateRenderInfoArgs): RenderInfo {
  const {
    offsetX,
    maxRenderWidth,
    useVirtual: useVirtualProp,
    columns: columnsProp,
    dataSource: dataSourceProp,
    defaultColumnWidth,
    getVerticalRenderRange,
  } = table;

  const columns = processColumns(columnsProp, defaultColumnWidth);
  const leftNestedLockCount = getLeftNestedLockCount(columns);
  const fullFlat = collectNodes(columns, 'leaf-only');

  let flat: RenderInfo['flat'];
  let nested: RenderInfo['nested'];
  let useVirtual: RenderInfo['resolvedUseVirtual'];

  if (leftNestedLockCount === columns.length) {
    flat = { left: [], right: [], full: fullFlat, center: fullFlat };
    nested = { left: [], right: [], full: columns, center: columns };
    useVirtual = { horizontal: false, vertical: false, header: false };
  } else {
    const leftNested = columns.slice(0, leftNestedLockCount);
    const rightNestedLockCount = getLeftNestedLockCount(columns.slice().reverse());
    const centerNested = columns.slice(leftNestedLockCount, columns.length - rightNestedLockCount);
    const rightNested = columns.slice(columns.length - rightNestedLockCount);

    const shouldEnableHozVirtual =
      fullFlat.length >= AUTO_VIRTUAL_THRESHOLD && fullFlat.every((col) => col.width != null);
    const shouldEnableVerVirtual = dataSourceProp.length >= AUTO_VIRTUAL_THRESHOLD;

    useVirtual = {
      horizontal: resolveVirtualEnabled(
        typeof useVirtualProp === 'object' ? useVirtualProp.horizontal : useVirtualProp,
        shouldEnableHozVirtual,
      ),
      vertical: resolveVirtualEnabled(
        typeof useVirtualProp === 'object' ? useVirtualProp.vertical : useVirtualProp,
        shouldEnableVerVirtual,
      ),
      header: resolveVirtualEnabled(
        typeof useVirtualProp === 'object' ? useVirtualProp.header : useVirtualProp,
        false,
      ),
    };

    flat = {
      left: collectNodes(leftNested, 'leaf-only'),
      full: fullFlat,
      right: collectNodes(rightNested, 'leaf-only'),
      center: collectNodes(centerNested, 'leaf-only'),
    };

    nested = {
      left: leftNested,
      full: columns,
      right: rightNested,
      center: centerNested,
    };
  }

  const horizontalRenderRange = getHorizontalRenderRange({
    maxRenderWidth,
    offsetX,
    useVirtual,
    flat,
  });
  const verticalRenderRange = getVerticalRenderRange(useVirtual);

  const { leftBlank, leftIndex, rightBlank, rightIndex } = horizontalRenderRange;
  const unfilteredVisibleColumnDescriptors: VisibleColumnDescriptor[] = [
    ...flat.left.map((col, i) => ({ type: 'normal', col, colIndex: i } as const)),
    leftBlank > 0 && { type: 'blank', blankSide: 'left', width: leftBlank },
    ...flat.center
      .slice(leftIndex, rightIndex)
      .map(
        (col, i) => ({ type: 'normal', col, colIndex: flat.left.length + leftIndex + i } as const),
      ),
    rightBlank > 0 && { type: 'blank', blankSide: 'right', width: rightBlank },
    ...flat.right.map(
      (col, i) =>
        ({ type: 'normal', col, colIndex: flat.full.length - flat.right.length + i } as const),
    ),
  ];
  const visibleColumnDescriptors = unfilteredVisibleColumnDescriptors.filter(Boolean);

  const fullFlatCount = flat.full.length;
  const leftFlatCount = flat.left.length;
  const rightFlatCount = flat.right.length;

  const stickyLeftMap = new Map<number, number>();
  let stickyLeft = 0;

  for (let i = 0; i < leftFlatCount; i++) {
    stickyLeftMap.set(i, stickyLeft);
    stickyLeft += flat.full[i].width;
  }

  const stickyRightMap = new Map<number, number>();
  let stickyRight = 0;

  for (let j = 0; j < rightFlatCount; j++) {
    stickyRightMap.set(fullFlatCount - 1 - j, stickyRight);
    stickyRight += flat.full[fullFlatCount - 1 - j].width;
  }

  const leftLockTotalWidth = sum(flat.left.map((col) => col.width));
  const rightLockTotalWidth = sum(flat.right.map((col) => col.width));

  return {
    horizontalRenderRange,
    verticalRenderRange,
    renderColumns: visibleColumnDescriptors,
    flat,
    nested,
    resolvedUseVirtual: useVirtual,
    stickyLeftMap,
    stickyRightMap,
    leftLockTotalWidth,
    rightLockTotalWidth,
    hasLockColumn: nested.left.length > 0 || nested.right.length > 0,
  };
}

function range(n: number) {
  const array: number[] = [];
  for (let i = 0; i < n; i++) {
    array.push(i);
  }
  return array;
}

type ColWithRenderInfo =
  | {
      type: 'normal';
      colIndex: number;
      col: ArtColumn;
      colSpan: number;
      isLeaf: boolean;
      width: number;
    }
  | { type: 'blank'; blankSide: 'left' | 'right'; width: number };

type IndexedCol = {
  colIndex: number;
  col: ArtColumn;
  children?: IndexedCol[];
};

/** 根据当前横向虚拟滚动 对 nested.center 进行过滤，结果只保留当前视野内可见的那些列配置 */
function filterNestedCenter(
  centerNested: ArtColumn[],
  hoz: HorizontalRenderRange,
  leftFlatCount: number,
) {
  return dfs(centerNested, leftFlatCount).filtered;

  function dfs(cols: ArtColumn[], startColIndex: number) {
    let leafCount = 0;

    const filtered: IndexedCol[] = [];

    for (const col of cols) {
      const colIndex = startColIndex + leafCount;
      if (isLeafNode(col)) {
        leafCount += 1;
        if (
          leftFlatCount + hoz.leftIndex <= colIndex &&
          colIndex < leftFlatCount + hoz.rightIndex
        ) {
          filtered.push({ colIndex, col });
        }
      } else {
        const dfsRes = dfs(col.children, colIndex);
        leafCount += dfsRes.leafCount;
        if (dfsRes.filtered.length > 0) {
          filtered.push({ colIndex, col, children: dfsRes.filtered });
        }
      }
    }

    return { filtered, leafCount };
  }
}

/** 根据输入的 nested 列配置，算出相应的 leveled & flat 配置方便渲染 */
function calculateLeveledAndFlat(inputNested: IndexedCol[], rowCount: number) {
  const leveled: ColWithRenderInfo[][] = [];
  for (let depth = 0; depth < rowCount; depth++) {
    leveled.push([]);
  }
  const flat: ColWithRenderInfo[] = [];

  dfs(inputNested, 0);

  function dfs(input: IndexedCol[], depth: number) {
    let leafCount = 0;
    for (let i = 0; i < input.length; i++) {
      const indexedCol = input[i];

      if (isLeafNode(indexedCol)) {
        leafCount += 1;
        const wrapped = {
          type: 'normal' as const,
          width: indexedCol.col.width,
          col: indexedCol.col,
          colIndex: indexedCol.colIndex,
          colSpan: 1,
          isLeaf: true,
        };
        leveled[depth].push(wrapped);
        flat.push(wrapped);
      } else {
        const dfsRes = dfs(indexedCol.children, depth + 1);
        leafCount += dfsRes.leafCount;
        if (dfsRes.leafCount > 0) {
          leveled[depth].push({
            type: 'normal',
            width: indexedCol.col.width,
            col: indexedCol.col,
            colIndex: indexedCol.colIndex,
            colSpan: dfsRes.leafCount,
            isLeaf: false,
          });
        }
      }
    }

    return { leafCount };
  }

  return { flat, leveled };


}

/** 包装列配置，附加上 colIndex 属性 */
function attachColIndex(inputNested: ArtColumn[], colIndexOffset: number) {
  return dfs(inputNested, colIndexOffset).result;

  function dfs(input: ArtColumn[], startColIndex: number) {
    const result: IndexedCol[] = [];

    let leafCount = 0;
    for (let i = 0; i < input.length; i++) {
      const col = input[i];
      const colIndex = startColIndex + leafCount;

      if (isLeafNode(col)) {
        leafCount += 1;
        result.push({ colIndex, col });
      } else {
        const sub = dfs(col.children, colIndex);
        leafCount += sub.leafCount;
        if (sub.leafCount > 0) {
          result.push({ col, colIndex, children: sub.result });
        }
      }
    }
    return { result, leafCount };
  }
}


export const calculateHeaderRenderInfo = (
  { flat, nested, horizontalRenderRange: hoz, resolvedUseVirtual }: HeaderRenderInfoArg,
  rowCount: number,
): { flat: ColWithRenderInfo[]; leveled: ColWithRenderInfo[][] } => {
  if (resolvedUseVirtual.header) {
    const leftPart = calculateLeveledAndFlat(attachColIndex(nested.left, 0), rowCount);
    const filtered = filterNestedCenter(nested.center, hoz, flat.left.length);
    const centerPart = calculateLeveledAndFlat(filtered, rowCount);
    const rightPart = calculateLeveledAndFlat(
      attachColIndex(nested.right, flat.left.length + flat.center.length),
      rowCount,
    );

    return {
      flat: [
        ...leftPart.flat,
        { type: 'blank', width: hoz.leftBlank, blankSide: 'left' },
        ...centerPart.flat,
        { type: 'blank', width: hoz.rightBlank, blankSide: 'right' },
        ...rightPart.flat,
      ],
      leveled: range(rowCount).map((depth) => [
        ...leftPart.leveled[depth],
        { type: 'blank', width: hoz.leftBlank, blankSide: 'left' },
        ...centerPart.leveled[depth],
        { type: 'blank', width: hoz.rightBlank, blankSide: 'right' },
        ...rightPart.leveled[depth],
      ]),
    };
  }

  return calculateLeveledAndFlat(attachColIndex(nested.full, 0), rowCount);
};

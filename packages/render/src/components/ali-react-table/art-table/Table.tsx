import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import * as op from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subscription, noop } from 'rxjs';
import cx from 'classnames';

import {
  Loading,
  ArtTableWrapper,
  LockShadows,
  StickyScroll,
} from '@/components/ali-react-table/component';

import { RenderInfo } from '@/components/ali-react-table/interfaces';

import { ResolvedUseVirtual, VerticalRenderRange, BaseTableProps } from './interfaces';

import { useForceUpdate } from '@/components/ali-react-table/hooks';

import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';

import {
  getScrollbarSize,
  shallowEqual,
  syncScrollLeft,
  throttledWindowResize$,
  getFullRenderRange,
  makeRowHeightManager,
  OVER_SCAN_SIZE,
  getRichVisibleRectsStream,
  calculateRenderInfo,
  sum,
  TableDOMHelper,
  toArray,
} from '@/components/ali-react-table/utils';

export interface ArtTableProps extends BaseTableProps {}

const ArtTable: FC<ArtTableProps> = (props) => {
  const {
    primaryKey,
    getRowProps,
    stickyTop,
    stickyBottom,
    isStickyFooter,
    footerDataSource,
    estimatedRowHeight,
    isStickyHeader,
    hasHeader,
    useVirtual,
    dataSource,
    columns,
    style,
    defaultColumnWidth,
    useOuterBorder,
    className,
    loading,
    hasStickyScroll,
    stickyScrollHeight: stickyScrollHeightProp,
    virtualDebugLabel,
  } = props;

  const artTableWrapperRef = useRef();

  const forceUpdate = useForceUpdate();

  const rootSubscription = useMemo(() => {
    return new Subscription();
  }, []);

  const props$ = useMemo<BehaviorSubject<ArtTableProps>>(() => {
    return new BehaviorSubject(props);
  }, []);

  const domHelperRef = useRef<TableDOMHelper>();

  const [offsetX, setOffsetX] = useState(() => {
    return 0;
  });

  const [offsetY, setOffsetY] = useState(() => {
    return 0;
  });

  const [maxRenderHeight, setMaxRenderHeight] = useState(() => {
    return 600;
  });

  const [maxRenderWidth, setMaxRenderWidth] = useState(() => {
    return 800;
  });

  const [hasScroll, setHasScroll] = useState(() => {
    return true;
  });

  const [needRenderLock, setNeedRenderLock] = useState(() => {
    return true;
  });

  const [renderData] = useState(dataSource);

  const getVerticalRenderRange = (useVirtual: ResolvedUseVirtual): VerticalRenderRange => {
    const rowCount = dataSource.length;
    if (useVirtual.vertical) {
      return rowHeightManager.getRenderRange(offsetY, maxRenderHeight, rowCount);
    } else {
      return getFullRenderRange(rowCount);
    }
  };

  const lastInfoRef = useRef<RenderInfo>(
    calculateRenderInfo({
      offsetX,
      maxRenderWidth,
      useVirtual,
      columns,
      dataSource,
      defaultColumnWidth,
      getVerticalRenderRange,
    }),
  );

  const rowHeightManager = useMemo(() => {
    return makeRowHeightManager(dataSource?.length || 0, estimatedRowHeight);
  }, []);

  lastInfoRef.current = calculateRenderInfo({
    offsetX,
    maxRenderWidth,
    useVirtual,
    columns,
    dataSource,
    defaultColumnWidth,
    getVerticalRenderRange,
  });

  const {
    hasLockColumn,
    renderColumns,
    verticalRenderRange,
    horizontalRenderRange,
    flat,
    stickyLeftMap,
    stickyRightMap,
    leftLockTotalWidth,
    rightLockTotalWidth,
    nested,
    resolvedUseVirtual,
  } = lastInfoRef.current;

  const updateOffsetX = (nextOffsetX: number) => {
    if (resolvedUseVirtual.horizontal) {
      if (Math.abs(nextOffsetX - offsetX) >= OVER_SCAN_SIZE / 2) {
        setOffsetX(nextOffsetX);
      }
    }
  };

  const updateDOMHelper = () => {
    domHelperRef.current = new TableDOMHelper(artTableWrapperRef.current);
  };

  const syncHorizontalScroll = (x: number) => {
    const domHelper = domHelperRef.current;

    updateOffsetX(x);

    const { tableBody, getLeftLockShadow, getRightLockShadow } = domHelper;

    const leftLockShadow = getLeftLockShadow();
    if (leftLockShadow) {
      const shouldShowLeftLockShadow = flat.left.length > 0 && needRenderLock && x > 0;
      if (shouldShowLeftLockShadow) {
        leftLockShadow.classList.add('show-shadow');
      } else {
        leftLockShadow.classList.remove('show-shadow');
      }
    }

    const rightLockShadow = getRightLockShadow();
    if (rightLockShadow) {
      const shouldShowRightLockShadow =
        flat.right.length > 0 &&
        needRenderLock &&
        x < tableBody.scrollWidth - tableBody.clientWidth;

      if (shouldShowRightLockShadow) {
        rightLockShadow.classList.add('show-shadow');
      } else {
        rightLockShadow.classList.remove('show-shadow');
      }
    }
  };

  const syncHorizontalScrollFromTableBody = () => {
    syncHorizontalScroll(domHelperRef.current.tableBody.scrollLeft);
  };

  const updateStickyScroll = () => {
    const { stickyScroll, artTable, stickyScrollItem, getTableBodyHtmlTable } =
      domHelperRef.current;

    if (!artTable) {
      return;
    }
    const tableBodyHtmlTable = getTableBodyHtmlTable();
    const innerTableWidth = tableBodyHtmlTable.offsetWidth;
    const artTableWidth = artTable.offsetWidth;

    const stickyScrollHeight =
      stickyScrollHeightProp === 'auto' ? getScrollbarSize().height : stickyScrollHeightProp;

    stickyScroll.style.marginTop = `-${stickyScrollHeight + 1}px`;

    if (artTableWidth >= innerTableWidth) {
      if (hasScroll) {
        setHasScroll(false);
      }
    } else {
      if (!hasScroll && stickyScrollHeight > 5) {
        // 考虑下mac下面隐藏滚动条的情况
        setHasScroll(true);
      }
    }
    // 设置子节点宽度
    stickyScrollItem.style.width = `${innerTableWidth}px`;
  };

  const updateRowHeightManager = () => {
    const { getVirtualTop, getTableRows } = domHelperRef.current;

    const virtualTop = getVirtualTop();
    const virtualTopHeight = virtualTop?.clientHeight ?? 0;

    let zeroHeightRowCount = 0;
    let maxRowIndex = -1;
    let maxRowBottom = -1;

    const tableRows = getTableRows();

    tableRows.forEach((tr) => {
      const rowIndex = Number(tr.dataset.rowindex);
      if (!isNaN(rowIndex)) {
        maxRowIndex = Math.max(maxRowIndex, rowIndex);
        const offset = tr.offsetTop + virtualTopHeight;
        const size = tr.offsetHeight;
        if (size === 0) {
          zeroHeightRowCount += 1;
        }

        maxRowBottom = Math.max(maxRowBottom, offset + size);
        rowHeightManager.updateRow(rowIndex, offset, size);
      }
    });

    // 当 estimatedRowHeight 过大时，可能出现「渲染行数过少，无法覆盖可视范围」的情况
    // 出现这种情况时，我们判断「下一次渲染能够渲染更多行」是否满足，满足的话就直接调用 forceUpdate
    // zeroHeightRowCount === 0 用于确保当前没有 display=none 的情况
    if (maxRowIndex !== -1 && zeroHeightRowCount === 0) {
      if (maxRowBottom < offsetY + maxRenderHeight) {
        const vertical = getVerticalRenderRange(resolvedUseVirtual);
        if (vertical.bottomIndex - 1 > maxRowIndex) {
          forceUpdate();
        }
      }
    }
  };

  const adjustNeedRenderLock = () => {
    const { artTable } = domHelperRef.current;

    if (hasLockColumn) {
      const sumOfColWidth = sum(flat.full.map((col) => col.width));
      const nextNeedRenderLock = sumOfColWidth > artTable.clientWidth;
      if (needRenderLock !== nextNeedRenderLock) {
        setNeedRenderLock(nextNeedRenderLock);
      }
    } else {
      if (needRenderLock) {
        setNeedRenderLock(false);
      }
    }
  };

  const initSubscriptions = () => {
    const { tableHeader, tableBody, tableFooter, stickyScroll, artTable, getLoadingIndicator } =
      domHelperRef.current;

    rootSubscription.add(
      throttledWindowResize$.subscribe(() => {
        updateStickyScroll();
        adjustNeedRenderLock();
      }),
    );

    // 滚动同步
    rootSubscription.add(
      syncScrollLeft([tableHeader, tableBody, tableFooter, stickyScroll], (scrollLeft) => {
        syncHorizontalScroll(scrollLeft);
      }),
    );

    const richVisibleRects$ = getRichVisibleRectsStream(
      artTable,
      props$.pipe(
        op.skip(1),
        op.map(() => 'structure-may-change'),
      ),
      virtualDebugLabel,
    ).pipe(op.shareReplay());

    // 每当可见部分发生变化的时候，调整 loading icon 的未知（如果 loading icon 存在的话）
    rootSubscription.add(
      combineLatest([
        richVisibleRects$.pipe(
          op.map((p) => p.clipRect),
          op.distinctUntilChanged(shallowEqual),
        ),
        props$.pipe(
          op.startWith(null),
          op.pairwise(),
          op.filter(
            ([prevProps, props]) => prevProps == null || (!prevProps.loading && props.loading),
          ),
        ),
      ]).subscribe(([clipRect]) => {
        const loadingIndicator = getLoadingIndicator();
        if (!loadingIndicator) {
          return;
        }
        const height = clipRect.bottom - clipRect.top;
        // fixme 这里的定位在有些特殊情况下可能会出错 see #132
        loadingIndicator.style.top = `${height / 2}px`;
        loadingIndicator.style.marginTop = `${height / 2}px`;
      }),
    );

    // 每当可见部分发生变化的时候，如果开启了虚拟滚动，则重新触发 render
    rootSubscription.add(
      richVisibleRects$
        .pipe(
          op.filter(() => {
            const { horizontal, vertical } = lastInfoRef.current.resolvedUseVirtual;
            return horizontal || vertical;
          }),
          op.map(({ clipRect, offsetY }) => ({
            maxRenderHeight: clipRect.bottom - clipRect.top,
            maxRenderWidth: clipRect.right - clipRect.left,
            offsetY,
          })),
          op.distinctUntilChanged((x, y) => {
            // 因为 over scan 的存在，滚动较小的距离时不需要触发组件重渲染
            return (
              Math.abs(x.maxRenderWidth - y.maxRenderWidth) < OVER_SCAN_SIZE / 2 &&
              Math.abs(x.maxRenderHeight - y.maxRenderHeight) < OVER_SCAN_SIZE / 2 &&
              Math.abs(x.offsetY - y.offsetY) < OVER_SCAN_SIZE / 2
            );
          }),
        )
        .subscribe((sizeAndOffset) => {
          const { maxRenderHeight, maxRenderWidth, offsetY } = sizeAndOffset;

          setMaxRenderHeight(maxRenderHeight);
          setMaxRenderWidth(maxRenderWidth);
          setOffsetY(offsetY);
        }),
    );
  };

  const updateScrollLeftWhenLayoutChanged = () => {
    const { stickyScroll, tableFooter, tableBody } = domHelperRef.current;

    if (hasScroll) {
      stickyScroll.scrollLeft = 0;
    }

    const currentHasFooter = toArray(footerDataSource).length > 0;

    if (currentHasFooter) {
      tableFooter.scrollLeft = tableBody.scrollLeft;
    }
  };

  const didMountOrUpdate = () => {
    syncHorizontalScrollFromTableBody();
    updateStickyScroll();
    adjustNeedRenderLock();
    updateRowHeightManager();
    updateScrollLeftWhenLayoutChanged();
  };

  useEffect(() => {
    updateDOMHelper();
  }, []);

  useEffect(() => {
    didMountOrUpdate();
  }, []);

  useEffect(() => {
    initSubscriptions();
  }, []);

  const showFooter = useMemo(() => {
    return toArray(footerDataSource).length > 0;
  }, [footerDataSource]);

  return (
    <ArtTableWrapper
      className={cx(
        'art-art-table-wrapper',
        {
          'use-outer-border': useOuterBorder,
          empty: dataSource.length === 0,
          lock: hasLockColumn,
          'has-header': hasHeader,
          'sticky-header': isStickyHeader,
          'has-footer': showFooter,
          'sticky-footer': isStickyFooter,
        },
        className,
      )}
      style={style}
      ref={artTableWrapperRef}
    >
      <Loading loading={loading}>
        <div className="art-table">
          <TableHeader
            horizontalRenderInfo={{
              flat,
              horizontalRenderRange,
              stickyLeftMap,
              stickyRightMap,
              nested,
              resolvedUseVirtual,
            }}
            hasHeader={hasHeader}
            stickyTop={stickyTop}
          />

          <TableBody
            dataSource={renderData}
            columns={renderColumns}
            noScrollbar={showFooter}
            getRowProps={getRowProps}
            primaryKey={primaryKey}
            loading={loading}
            horizontalRenderInfo={{
              flat,
              horizontalRenderRange,
              stickyLeftMap,
              stickyRightMap,
            }}
            verticalRenderRange={verticalRenderRange}
          />

          <TableFooter
            dataSource={footerDataSource}
            columns={renderColumns}
            horizontalRenderInfo={{
              horizontalRenderRange,
              flat,
              stickyLeftMap,
              stickyRightMap,
            }}
            stickyBottom={stickyBottom}
            getRowProps={getRowProps}
            primaryKey={primaryKey}
          />

          <LockShadows
            leftLockTotalWidth={leftLockTotalWidth}
            rightLockTotalWidth={rightLockTotalWidth}
          />
        </div>

        <StickyScroll
          stickyBottom={stickyBottom}
          hasStickyScroll={hasStickyScroll}
          hasScroll={hasScroll}
        />
      </Loading>
    </ArtTableWrapper>
  );
};

ArtTable.defaultProps = {
  hasHeader: true,
  isStickyHeader: true,
  stickyTop: 0,
  dataSource: [],
  footerDataSource: [],
  isStickyFooter: true,
  stickyBottom: 0,
  hasStickyScroll: true,
  stickyScrollHeight: 'auto',
  useVirtual: 'auto',
  estimatedRowHeight: 48,
  loading: false,
  getRowProps: () => ({}),
  // defaultColumnWidth: 120
};

export default ArtTable;

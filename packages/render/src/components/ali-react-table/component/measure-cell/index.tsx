import { FC, useEffect, useRef } from 'react';

import ResizeObserver from 'resize-observer-polyfill';

interface MeasureCellProps {
  index: number;
  columnKey: string;
  onColumnResize: (columnKey: string, width: number, index: number) => void;
}

const MeasureCell: FC<MeasureCellProps> = ({ columnKey, onColumnResize, index }) => {
  const cellRef = useRef<HTMLTableCellElement>();

  useEffect(() => {
    const resizeObserver = new ResizeObserver((resizeObserverEntry) => {
      resizeObserverEntry.forEach((entries) => {
        const { width } = entries.contentRect || {};
        onColumnResize?.(columnKey, width, index);
      });
    });

    const ele = cellRef.current;

    resizeObserver.observe(ele);

    return () => {
      if (ele) {
        resizeObserver.unobserve(ele);
      }
    };
  }, []);

  return (
    <td data-column-key={columnKey} ref={cellRef} style={{ padding: 0, border: 0, height: 0 }}>
      <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
    </td>
  );
};

export default MeasureCell;

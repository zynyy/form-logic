import MeasureCell from '../measure-cell';
import { ArtColumn } from '@/components/ali-react-table/interfaces';
import { useRef } from 'react';

export interface ResizesType {
  column: string;
  width: number;
}

export interface MeasureCellProps {
  onColumnResize: (resizes: ResizesType[]) => void;
  columns: ArtColumn[];
}

const MeasureRow = ({ columns, onColumnResize }: MeasureCellProps) => {
  const resizesRef = useRef<ResizesType[]>([]);

  const handleColumnResize = (columnKey: string, width: number, index: number) => {
    resizesRef.current[index] = {
      column: columnKey,
      width,
    };

    if (resizesRef.current.length === columns.length) {
      onColumnResize?.(resizesRef.current);
    }
  };

  return (
    <tr aria-hidden="true" className="art-measure-row" style={{ height: 0, fontSize: 0 }}>
      {columns.map((column, index) => {
        const { code } = column || {};

        return (
          <MeasureCell
            index={index}
            key={code}
            columnKey={code}
            onColumnResize={handleColumnResize}
          />
        );
      })}
    </tr>
  );
};

export default MeasureRow;

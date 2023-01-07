import { FC } from 'react';
import { VisibleColumnDescriptor } from '@/components/ali-react-table/art-table/interfaces';

export interface ColgroupProps {
  columns: VisibleColumnDescriptor[];
}

const Colgroup: FC<ColgroupProps> = ({ columns }) => {
  return (
    <colgroup>
      {columns.map((descriptor) => {
        const { type } = descriptor;

        if (type === 'blank') {
          const { blankSide, width } = descriptor;

          return  <col key={blankSide} style={{ width: width }} />;
        }

        const { colIndex, col } = descriptor;

        return <col key={colIndex} style={{ width: col.width }} />;
      })}
    </colgroup>
  );
};

export default Colgroup;

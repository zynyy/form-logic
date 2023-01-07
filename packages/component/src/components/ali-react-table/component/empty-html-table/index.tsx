import cx from 'classnames';
import { FC } from 'react';
import { Empty } from 'antd';

import Colgroup, { ColgroupProps } from '@/components/ali-react-table/component/col-group';

export interface EmptyHtmlTableProps extends ColgroupProps {
  loading: boolean;
  emptyCellHeight?: number;
}

const EmptyHtmlTable: FC<EmptyHtmlTableProps> = ({ columns, loading, emptyCellHeight }) => {
  const show = !loading;

  return (
    <table>
      <Colgroup columns={columns} />
      <tbody>
        <tr className={cx('art-art-table-row', 'first', 'last', 'no-hover')} data-rowindex={0}>
          <td
            className={cx('art-art-table-cell', 'first', 'last')}
            colSpan={columns.length}
            style={{ height: emptyCellHeight ?? 200 }}
          >
            {show ? (
              <div className="art-empty-wrapper">
                <Empty
                  description={
                    <div
                      className="empty-tips"
                      style={{ marginTop: 8, color: 'rgba(0,0,0,.25)', fontSize: 14 }}
                    >
                      没有符合查询条件的数据
                      <br />
                      请修改条件后重新查询
                    </div>
                  }
                />
              </div>
            ) : null}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default EmptyHtmlTable;

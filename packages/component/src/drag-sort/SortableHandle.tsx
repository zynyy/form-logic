import { useSortableItemContext } from '@/drag-sort/hooks';
import { FC } from 'react';
import { DragOutlined } from '@ant-design/icons';

import cls from 'classnames';
import { useDragSortStyle } from '@/drag-sort/hooks';
import { AntdIconProps } from '@ant-design/icons/es/components/AntdIcon';

export interface SortableHandleProps
  extends Pick<AntdIconProps, 'className' | 'twoToneColor' | 'style' | 'spin' | 'rotate'> {}

const SortableHandle: FC<SortableHandleProps> = ({ className, ...dragProps }) => {
  const { attributes, listeners } = useSortableItemContext();

  const [warpSSR, hashId, prefixCls] = useDragSortStyle();

  return warpSSR(
    <DragOutlined
      {...dragProps}
      {...attributes}
      {...listeners}
      className={cls(`${prefixCls}-sort-handle`, hashId, className)}
    />,
  );
};

export default SortableHandle;

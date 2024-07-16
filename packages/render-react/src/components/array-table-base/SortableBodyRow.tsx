import { SortableElement } from '@formlogic/component';
import { FC, HTMLAttributes } from 'react';
import { useArrayTableBaseStyle } from '@/components/array-table-base/hooks';
import cls from 'classnames';

const SortableRowElement = SortableElement((props) => <tr {...props} />);

const SortableBodyRow: FC<HTMLAttributes<HTMLTableRowElement> & { index: number }> = ({
  className,
  index,
  ...props
}) => {
  const [warpSSR, hashId, prefixCls] = useArrayTableBaseStyle();

  return warpSSR(
    <SortableRowElement
      lockAxis="y"
      {...props}
      index={index}
      className={cls(className, hashId, `${prefixCls}-row-${index + 1}`)}
    />,
  );
};

export default SortableBodyRow;

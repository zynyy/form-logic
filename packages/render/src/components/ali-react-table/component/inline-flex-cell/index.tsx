import { FC, PropsWithChildren, HTMLAttributes } from 'react';

import cn from 'classnames';

export interface InlineFlexCellProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  classNames?: string;
}

const InlineFlexCell: FC<InlineFlexCellProps> = ({ children, classNames, ...restProps }) => {
  return (
    <div {...restProps} className={cn('inline-flex-cell', classNames)}>
      {children}
    </div>
  );
};

export default InlineFlexCell;

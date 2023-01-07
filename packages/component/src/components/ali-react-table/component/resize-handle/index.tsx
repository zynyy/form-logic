import { FC, PropsWithChildren, HTMLAttributes } from 'react';
import cn from 'classnames';

export interface ResizeHandleProps extends PropsWithChildren, HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const ResizeHandle: FC<ResizeHandleProps> = ({ className, children, ...restProps }) => {
  return (
    <span className={cn('resize-handle', className)} {...restProps}>
      {children}
    </span>
  );
};

export default ResizeHandle;

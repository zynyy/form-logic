import React, { FC, PropsWithChildren, HTMLAttributes, forwardRef } from 'react';

export interface ArtTableWrapperProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  className?: string;
}

type ArtTableWrapperRef = HTMLDivElement;

const ArtTableWrapper = forwardRef<ArtTableWrapperRef, ArtTableWrapperProps>(
  ({ children, ...restProps }, ref) => {
    return (
      <div {...restProps} ref={ref}>
        {children}
      </div>
    );
  },
);

export default ArtTableWrapper;

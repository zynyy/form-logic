import SortableContainer from './SortableContainer';

import { useSortableBodyContext } from './hooks';

import { FC, HTMLAttributes } from 'react';

const SortableBodyContainer = SortableContainer((props) => <tbody {...props} />);

const SortableBodyWrapper: FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  const { containerRef, list, start, onSortEnd } = useSortableBodyContext();

  return (
    <SortableBodyContainer
      {...props}
      accessibility={{
        container: containerRef.current || undefined,
      }}
      onSortEnd={onSortEnd}
      start={start}
      list={list}
    >
      {children}
    </SortableBodyContainer>
  );
};

export default SortableBodyWrapper;

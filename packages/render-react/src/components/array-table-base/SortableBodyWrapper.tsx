import { SortableContainer } from '@formlogic/component';
import { useField } from '@formily/react';
import { ArrayField } from '@formily/core';
import { useArrayTableBaseStyle, useSortableContext } from '@/components/array-table-base/hooks';
import cls from 'classnames';
import { FC, HTMLAttributes } from 'react';

const SortableBodyContainer = SortableContainer((props) => <tbody {...props} />);

const SortableBodyWrapper: FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => {
  const field = useField<ArrayField>();
  const [warpSSR, hashId, prefixCls] = useArrayTableBaseStyle();

  const { containerRef, list, start } = useSortableContext();

  const addTdStyles = (id) => {
    const node = containerRef.current?.querySelector(`.${prefixCls}-row-${id}`);
    const helper = containerRef.current?.querySelector(`.${prefixCls}-sort-helper`);

    if (helper) {
      const tds = node?.querySelectorAll('td');
      if (tds) {
        requestAnimationFrame(() => {
          helper.querySelectorAll('td').forEach((td, index) => {
            if (tds[index]) {
              td.style.width = getComputedStyle(tds[index]).width;
            }
          });
        });
      }
    }
  };

  const handleSortStart = (event) => {
    addTdStyles(event.active.id);
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      field.move(oldIndex, newIndex).then(() => void 0);
    }
  };

  return warpSSR(
    <SortableBodyContainer
      {...props}
      accessibility={{
        container: containerRef.current || undefined,
      }}
      start={start}
      list={list}
      onSortStart={handleSortStart}
      onSortEnd={handleSortEnd}
      className={cls(`${prefixCls}-sort-helper`, hashId, className)}
    >
      {children}
    </SortableBodyContainer>,
  );
};

export default SortableBodyWrapper;

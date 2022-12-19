import cx from 'classnames';
import { FC } from 'react';

export interface StickyScrollProps {
  stickyBottom: number;
  hasStickyScroll: boolean;
  hasScroll: boolean;
}

const StickyScroll: FC<StickyScrollProps> = ({ stickyBottom, hasScroll, hasStickyScroll }) => {
  return (
    <div
      className={cx('art-sticky-scroll', 'art-horizontal-scroll-container')}
      style={{
        display: hasStickyScroll && hasScroll ? 'block' : 'none',
        bottom: stickyBottom,
      }}
    >
      <div className="art-sticky-scroll-item" />
    </div>
  );
};

export default StickyScroll;

import cx from 'classnames';
import React, { FC } from 'react';

const LOCK_SHADOW_PADDING = 20;

export interface LockShadowsProps {
  leftLockTotalWidth: number;
  rightLockTotalWidth: number;
}

const LockShadows: FC<LockShadowsProps> = ({ leftLockTotalWidth, rightLockTotalWidth }) => {
  return (
    <>
      <div
        className="art-lock-shadow-mask"
        style={{ left: 0, width: leftLockTotalWidth + LOCK_SHADOW_PADDING }}
      >
        <div className={cx('art-lock-shadow', 'art-left-lock-shadow')} />
      </div>
      <div
        className="art-lock-shadow-mask"
        style={{ right: 0, width: rightLockTotalWidth + LOCK_SHADOW_PADDING }}
      >
        <div className={cx('art-lock-shadow', 'art-right-lock-shadow')} />
      </div>
    </>
  );
};

export default LockShadows;

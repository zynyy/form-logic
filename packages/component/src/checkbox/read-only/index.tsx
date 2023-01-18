import { useCheckboxStyle } from '@/checkbox/hooks';
import cls from 'classnames';
import { FC, PropsWithChildren, ReactNode } from 'react';

export interface ReadOnlyCheckboxProps extends PropsWithChildren {
  checked: boolean;
  indeterminate?: boolean;
}

const ReadOnlyCheckbox: FC<ReadOnlyCheckboxProps> = ({ checked, indeterminate, children }) => {
  const [warpSSR, hashId, prefixCls] = useCheckboxStyle();

  return warpSSR(
    <label className={cls(hashId, `${prefixCls}-wrapper`)}>
      <span
        className={cls(hashId, prefixCls, {
          [`${prefixCls}-checked`]: checked,
          [`${prefixCls}-indeterminate`]: indeterminate,
        })}
      >
        <span className={cls(`${prefixCls}-inner`)} />
      </span>
      {children !== undefined ? <span>{children}</span> : null}
    </label>,
  );
};

export default ReadOnlyCheckbox;

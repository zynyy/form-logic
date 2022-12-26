import React, {
  useLayoutEffect,
  useRef,
  useMemo,
  PropsWithChildren,
  FC,
  CSSProperties,
} from 'react';
import { markRaw } from '@formily/reactive';
import { observer } from '@formily/react';
import { Grid } from '@formily/grid';

import { useFormLayout } from '../form-layout/hooks';
import cn from 'classnames';
import { FormGridContext, FormGridValueContext, useFormGridStyle } from './hooks';

export interface FormGridProps extends FormGridValueContext, PropsWithChildren {
  className?: string;
  style?: CSSProperties;
}

const FormGrid: FC<FormGridProps> = observer(({ className, style, children, ...props }) => {
  const layout = useFormLayout();
  const options = {
    columnGap: layout?.gridColumnGap ?? 8,
    rowGap: layout?.gridRowGap ?? 4,
    ...props,
  };

  const [wrapSSR, hashId, prefixCls] = useFormGridStyle();

  const grid = useMemo(() => markRaw(new Grid(options)), [Grid.id(options)]);

  const ref = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    return grid.connect(ref.current);
  }, [grid]);

  return wrapSSR(
    <FormGridContext.Provider value={grid}>
      <div
        className={cn(`${prefixCls}-layout`, hashId, className)}
        style={{
          ...style,
          gridTemplateColumns: grid.templateColumns,
          gap: grid.gap,
        }}
        ref={ref}
      >
        {children}
      </div>
    </FormGridContext.Provider>,
  );
});

export default FormGrid;

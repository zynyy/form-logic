import { Spin } from 'antd';
import { FC, PropsWithChildren } from 'react';

import { Portal } from '@antv/x6-react-shape';
import { ChartLayoutContext, ChartLayoutValueContext } from './hook';

import cls from 'classnames';

const X6ReactPortalProvider = Portal.getProvider();

export interface ChartLayoutProps extends PropsWithChildren, ChartLayoutValueContext {
  loading?: boolean;
  height?: number | string;
}

const ChartLayout: FC<ChartLayoutProps> = ({
  loading,
  height,
  children,
  mode,
  monacoEditorLoaderConfig,
  pattern,
  logicProcessConfig,
}) => {
  return (
    <Spin spinning={!!loading} wrapperClassName="chart-loading" size="large">
      <ChartLayoutContext.Provider
        value={{
          mode,
          monacoEditorLoaderConfig,
          logicProcessConfig,
          pattern,
        }}
      >
        <X6ReactPortalProvider />

        <div
          className={cls(
            'chart-warp',
            `chart-pattern-${(pattern || 'EDITABLE').toLocaleLowerCase()}`,
            {
              [`chart-mode-${(mode || '').toLocaleLowerCase()}`]: !!mode,
            },
          )}
          style={{
            height,
          }}
        >
          {children}
        </div>
      </ChartLayoutContext.Provider>
    </Spin>
  );
};

export default ChartLayout;

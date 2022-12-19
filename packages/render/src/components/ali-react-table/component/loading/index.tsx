import React, { FC, ReactNode } from 'react';
import { Spin } from 'antd';

export interface LoadingProps {
  loading?: boolean;
  children: ReactNode;
}

const Loading: FC<LoadingProps> = ({ loading, children }: LoadingProps) => {
  return (
    <div className="art-loading-wrapper">
      <Spin spinning={loading ?? false} tip="加载中。。。。">
        <div className="art-loading-content-wrapper" style={{ opacity: loading ? 0.6 : undefined }}>
          {children}
        </div>
      </Spin>
    </div>
  );
};

export default Loading;

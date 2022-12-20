import { Suspense } from 'react';

import { Spin } from 'antd';

const lazyLoader = (Component: any) => {

  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" tip="页面加载中。。。。" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default lazyLoader;

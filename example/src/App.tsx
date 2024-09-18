

import { ReactNode, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import './assets/css/App.css';
import './assets/css/formlogic.css';

import { ConfigProvider, Spin } from 'antd';

import zhCn from 'antd/locale/zh_CN';

import router from './router';

import { HelmetProvider } from 'react-helmet-async';

const App = (): ReactNode => {
  return (
    <ConfigProvider locale={zhCn}>
      {/*<HelmetProvider>*/}
      <Suspense fallback={<Spin />}>
        <RouterProvider router={router} />
      </Suspense>
      {/*</HelmetProvider>*/}
    </ConfigProvider>
  );
};

export default App;

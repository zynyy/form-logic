import { PageLoading } from '@formlogic/component';

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import './assets/css/App.css';
import './assets/css/formlogic.css';

import {ConfigProvider} from 'antd';

import zhCn from 'antd/locale/zh_CN'

import router from './router';


const App = () => (
  <ConfigProvider locale={zhCn}>
    <Suspense fallback={<PageLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  </ConfigProvider>

);

export default App;

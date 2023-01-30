import React from 'react';
import ReactDOM from 'react-dom/client';
import ChromeExtension from '@/chrome-extension';
import { ConfigProvider } from 'antd';
import zhCn from 'antd/locale/zh_CN';
import '@/assets/css/popup.css';
import { FormLogicDevtoolsScript } from '@/interface';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCn}>
      <ChromeExtension connectionName={FormLogicDevtoolsScript.popup} />
    </ConfigProvider>
  </React.StrictMode>,
);

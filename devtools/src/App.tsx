import { ConfigProvider } from 'antd';

import zhCn from 'antd/locale/zh_CN';

import '@/assets/css/App.css';

import ChromeExtension from '@/chrome-extension';
import { FormLogicDevtoolsScript } from '@/interface';

const App = () => {
  return (
    <ConfigProvider locale={zhCn}>
      <ChromeExtension connectionName={FormLogicDevtoolsScript.app} />
    </ConfigProvider>
  );
};

export default App;

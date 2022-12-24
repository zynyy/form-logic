import { Spin } from '@formlogic/render';

const PageLoading = () => (
  <div style={{ textAlign: 'center' }}>
    <Spin size="large" tip="页面加载中。。。。" />
  </div>
);

export default PageLoading;

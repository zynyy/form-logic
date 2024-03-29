import { Breadcrumb, Layout } from 'antd';

import GlobalHeader from './header/global-header';
import LeftNav from './sider/left-nav';
import { FC, PropsWithChildren } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageHeader from '@/components/page-header';

import useVisualHeight from '@/layouts/useVisualHeight';
import './style/index.css';

const { Content, Header } = Layout;

const BasicLayout: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return <Breadcrumb.Item key={url}>占位</Breadcrumb.Item>;
  });

  const height = useVisualHeight();

  return (
    <Layout
      style={{
        height: '100%',
      }}
    >
      <Header>
        <GlobalHeader />
      </Header>

      <Layout>
        <LeftNav />
        <Layout>
          <Content className="page-container">
            <PageHeader breadcrumb={<Breadcrumb>{breadcrumbItems}</Breadcrumb>} />
            <div
              style={{
                height,
              }}
              className="page-content-wrap"
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

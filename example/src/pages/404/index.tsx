import React from 'react';
import { Button, Result, Space } from '@formlogic/render';

import { useNavigate } from 'react-router-dom';

const NoFoundPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在"
      extra={
        <Space>
          <Button type="primary" onClick={handleClick}>
            返回登录页
          </Button>

          <Button type="primary" onClick={handleBack}>
            返回上一页
          </Button>
        </Space>
      }
    />
  );
};
export default NoFoundPage;

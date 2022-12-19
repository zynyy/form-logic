import { Button, Col, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalHeader = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login', {

    });
  };

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{
          height: '100%',
        }}
      >
        <Col span={24}>
          <Button onClick={handleClick}>退出登录</Button>
        </Col>
      </Row>
    </>
  );
};

export default GlobalHeader;

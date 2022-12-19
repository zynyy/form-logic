import React, { FC, useEffect, useMemo, useState } from 'react';

import { Tag, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { testLocalConnect } from '@/service';

export enum Status {
  connected = 'success',
  disconnected = 'error',
}

interface ConnectStatusProps {}

const ConnectStatus: FC<ConnectStatusProps> = () => {
  const [status, setStatus] = useState(Status.disconnected);

  useEffect(() => {
    testLocalConnect()
      .then(() => {
        setStatus(Status.connected);
      })
      .catch(() => {
        setStatus(Status.disconnected);
        notification.warning({
          message: '检测到本地环境未启动',
          description: '请先启动本地环境',
          duration: 10,
        });
      });
  }, []);

  const isConnected = useMemo(() => {
    return status === Status.connected;
  }, [status]);

  const tagText = useMemo(() => {
    return isConnected ? '本地连接成功' : '本地连接失败';
  }, [isConnected]);

  return (
    <div className="connect-status">
      <Tag color={status} icon={isConnected ? <CloseCircleOutlined /> : <CheckCircleOutlined />}>
        {tagText}
      </Tag>
    </div>
  );
};

export default ConnectStatus;

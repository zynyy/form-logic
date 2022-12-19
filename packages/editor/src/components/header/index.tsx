import { FC } from 'react';

import { Graph } from '@antv/x6';

import { Input, Space } from 'antd';

interface HeaderProps {
  graph: Graph | undefined;
  code: string;
}

const Header: FC<HeaderProps> = ({ code }) => {
  return (
    <Space>
      <Input disabled value={code} />
    </Space>
  );
};

export default Header;

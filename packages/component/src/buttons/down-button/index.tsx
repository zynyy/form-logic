import { Button, ButtonProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface DownButtonProps extends ButtonProps {}

const DownButton: FC<DownButtonProps> = ({ children, ...props }) => {
  return (
    <Button type="text" {...props} icon={<DownOutlined />}>
      {children}
    </Button>
  );
};

export default DownButton;

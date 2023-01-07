import { Button, ButtonProps } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface UpButtonProps extends ButtonProps {}

const UpButton: FC<UpButtonProps> = ({ children, ...props }) => {
  return (
    <Button type="text" {...props} icon={<UpOutlined />}>
      {children}
    </Button>
  );
};

export default UpButton;

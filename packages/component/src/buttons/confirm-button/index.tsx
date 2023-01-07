import { CheckOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { FC } from 'react';

export interface ConfirmButtonProps extends ButtonProps {}

const ConfirmButton: FC<ConfirmButtonProps> = ({ children, ...props }) => {
  return (
    <Button type="primary" {...props} icon={<CheckOutlined />}>
      {children || '确定'}
    </Button>
  );
};

export default ConfirmButton;

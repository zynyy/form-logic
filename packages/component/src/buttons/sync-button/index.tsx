import { Button, ButtonProps } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface SyncButtonProps extends ButtonProps {}

const SyncButton: FC<SyncButtonProps> = ({ children, ...props }) => {
  return (
    <Button shape="circle" {...props} icon={<RedoOutlined />}>
      {children}
    </Button>
  );
};

export default SyncButton;

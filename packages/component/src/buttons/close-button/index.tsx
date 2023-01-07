import { Button, ButtonProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface CloseButtonProps extends ButtonProps {}

const CloseButton: FC<CloseButtonProps> = ({ children, ...restProps }) => {
  return (
    <Button {...restProps} icon={<CloseOutlined />}>
      {children || "关闭"}
    </Button>
  );
};

export default CloseButton;

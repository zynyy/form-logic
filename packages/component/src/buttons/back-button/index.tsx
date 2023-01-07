import { Button, ButtonProps } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface BackButtonProps extends ButtonProps {}

const BackButton: FC<BackButtonProps> = ({ children, onClick, ...restProps }) => {
  const handleBackClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    history.back();
  };

  return (
    <Button {...restProps} onClick={handleBackClick} icon={<RollbackOutlined />}>
      {children || '返回'}
    </Button>
  );
};

export default BackButton;

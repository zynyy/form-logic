import { Button, ButtonProps } from 'antd';
import { FC, Ref } from 'react';
import { PlusOutlined } from '@ant-design/icons';

export interface PlusButtonProps extends ButtonProps {
  btnRef?: Ref<HTMLElement>;
}

const PlusButton: FC<PlusButtonProps> = ({ children, btnRef, ...props }) => {
  return (
    <Button type="text" {...props} icon={<PlusOutlined />} ref={btnRef}>
      {children}
    </Button>
  );
};

export default PlusButton;

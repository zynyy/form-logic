import { Button, ButtonProps } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface DetailButtonProps extends ButtonProps {}

const DetailButton: FC<DetailButtonProps> = ({ children, ...props }) => {
  return (
    <Button type="text" {...props} icon={<EyeOutlined />}>
      {children}
    </Button>
  );
};

export default DetailButton;

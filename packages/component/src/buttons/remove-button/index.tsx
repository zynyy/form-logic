import { Button, ButtonProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface RemoveButtonProps extends ButtonProps {}

const RemoveButton: FC<RemoveButtonProps> = ({ children, ...props }) => {
  return (
    <Button type="text" {...props} icon={<DeleteOutlined />}>
      {children}
    </Button>
  );
};

export default RemoveButton;

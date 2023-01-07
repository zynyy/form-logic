import { Button, ButtonProps } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface EditButtonProps extends ButtonProps {}

const EditButton: FC<EditButtonProps> = ({ children, ...props }) => {
  return (
    <Button type="text" {...props} icon={<EditOutlined />}>
      {children}
    </Button>
  );
};

export default EditButton;

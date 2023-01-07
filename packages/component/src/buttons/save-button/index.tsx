import { SaveOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { FC } from 'react';

export interface SaveButtonProps extends ButtonProps {}

const SaveButton: FC<SaveButtonProps> = ({ children, ...props }) => {
  return (
    <Button type="primary" {...props} icon={<SaveOutlined />}>
      {children || '保存'}
    </Button>
  );
};

export default SaveButton;

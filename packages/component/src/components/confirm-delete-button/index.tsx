import { Button, Popconfirm, PopconfirmProps } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface ConfirmDeleteButtonProps extends PopconfirmProps {}

const ConfirmDeleteButton: FC<ConfirmDeleteButtonProps> = (props) => {
  return (
    <Popconfirm {...props} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
      <Button danger type="text" icon={<DeleteOutlined />} />
    </Popconfirm>
  );
};

export default ConfirmDeleteButton;

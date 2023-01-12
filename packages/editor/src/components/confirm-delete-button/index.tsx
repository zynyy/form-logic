import { Popconfirm, PopconfirmProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { RemoveButton } from '@formlogic/component';
import { FC } from 'react';

export interface ConfirmDeleteButtonProps extends PopconfirmProps {}

const ConfirmDeleteButton: FC<ConfirmDeleteButtonProps> = (props) => {
  return (
    <Popconfirm {...props} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
      <RemoveButton danger />
    </Popconfirm>
  );
};

export default ConfirmDeleteButton;

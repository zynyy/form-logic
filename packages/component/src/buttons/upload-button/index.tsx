import { Button, Upload, UploadProps } from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import { FC } from 'react';

export interface UploadButtonProps extends UploadProps {}

const UploadButton: FC<UploadButtonProps> = ({ children, ...uploadProps }) => {
  return (
    <Upload {...uploadProps} showUploadList={false}>
      <Button icon={<UploadOutlined />}>{children}</Button>
    </Upload>
  );
};
export default UploadButton;

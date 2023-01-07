import CopyToClipboard from 'react-copy-to-clipboard';
import { FC } from 'react';
import { Button, ButtonProps, message } from 'antd';

import { CopyOutlined } from '@ant-design/icons';

export interface CopyButtonProps extends ButtonProps {
  text: string;
}

const CopyButton: FC<CopyButtonProps> = ({ text, children, ...btnProps }) => {
  const handleCopy = () => {
    message.success(`${text} 复制成功`).then(() => void 0);
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <Button type="text" {...btnProps} icon={<CopyOutlined />}>
        {children}
      </Button>
    </CopyToClipboard>
  );
};

export default CopyButton;

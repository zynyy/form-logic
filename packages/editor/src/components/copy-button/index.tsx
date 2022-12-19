import CopyToClipboard from 'react-copy-to-clipboard';
import { FC } from 'react';
import { Button } from 'antd';

import { CopyFilled } from '@ant-design/icons';

interface CopyButtonProps {
  text: string;
}

const CopyButton: FC<CopyButtonProps> = ({ text }) => {
  return (
    <CopyToClipboard text={text}>
      <Button type="link">
        <CopyFilled />
      </Button>
    </CopyToClipboard>
  );
};

export default CopyButton;

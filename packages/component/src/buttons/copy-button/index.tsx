import CopyToClipboard from 'react-copy-to-clipboard';
import { FC, forwardRef } from 'react';
import { message } from 'antd';

import { CopyOutlined } from '@ant-design/icons';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';
import { CustomButtonMode } from '@/interface';

export interface CopyButtonProps extends CustomButtonProps {
  text?: string;
  hasCopyToClipboard?: boolean;
}

const CopyButton: FC<CopyButtonProps> = forwardRef(
  ({ text, children, hasCopyToClipboard, ...btnProps }, ref) => {
    const handleCopy = () => {
      message.success(`${text} 复制成功`).then(() => void 0);
    };

    if (hasCopyToClipboard && text) {
      return (
        <CopyToClipboard text={text} onCopy={handleCopy}>
          <CustomButton
            hasTooltip
            mode={CustomButtonMode.icon}
            title={`点击复制 ${text}`}
            {...btnProps}
            icon={<CopyOutlined />}
            ref={ref}
          >
            {children}
          </CustomButton>
        </CopyToClipboard>
      );
    }

    return (
      <CustomButton
        hasTooltip
        mode={CustomButtonMode.icon}
        {...btnProps}
        icon={<CopyOutlined />}
        ref={ref}
      >
        {children}
      </CustomButton>
    );
  },
);

CopyButton.defaultProps = {
  hasCopyToClipboard: true,
};

export default CopyButton;

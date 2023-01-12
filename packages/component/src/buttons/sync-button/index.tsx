import { RedoOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';
import { CustomButtonMode } from '@/interface';

export interface SyncButtonProps extends CustomButtonProps {}

const SyncButton: FC<SyncButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton mode={CustomButtonMode.icon} {...props} icon={<RedoOutlined />} ref={ref}>
      {children}
    </CustomButton>
  );
});

export default SyncButton;

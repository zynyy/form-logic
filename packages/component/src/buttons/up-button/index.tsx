import { UpOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';
import { CustomButtonMode } from '@/interface';

export interface UpButtonProps extends CustomButtonProps {}

const UpButton: FC<UpButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton mode={CustomButtonMode.icon} {...props} icon={<UpOutlined />}>
      {children}
    </CustomButton>
  );
});

export default UpButton;

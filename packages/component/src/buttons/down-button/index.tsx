import { DownOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';
import { CustomButtonMode } from '@/interface';

export interface DownButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const DownButton: FC<DownButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton   mode={CustomButtonMode.icon} {...props} icon={<DownOutlined />} ref={ref}>
      {children}
    </CustomButton>
  );
});

export default DownButton;

import { EyeOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';
import { CustomButtonMode } from '@/interface';

export interface DetailButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const DetailButton: FC<DetailButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton
      mode={CustomButtonMode.icon}
      title="详情"
      {...props}
      icon={<EyeOutlined />}
      ref={ref}
    >
      {children}
    </CustomButton>
  );
});

export default DetailButton;

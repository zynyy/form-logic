import { CheckOutlined } from '@ant-design/icons';

import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';

export interface ConfirmButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const ConfirmButton: FC<ConfirmButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton title="确定" type="primary" {...props} icon={<CheckOutlined />} ref={ref}>
      {children}
    </CustomButton>
  );
});

export default ConfirmButton;

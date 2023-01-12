import { FC, forwardRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';

export interface PlusButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const PlusButton: FC<PlusButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton type="text" {...props} icon={<PlusOutlined />} ref={ref}>
      {children}
    </CustomButton>
  );
});

export default PlusButton;

import { EditOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';
import { CustomButtonMode } from '@/interface';

export interface EditButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const EditButton: FC<EditButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton mode={CustomButtonMode.icon} {...props} icon={<EditOutlined />} ref={ref}>
      {children}
    </CustomButton>
  );
});

export default EditButton;

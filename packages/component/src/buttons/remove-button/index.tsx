import { DeleteOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';
import { CustomButtonMode } from '@/interface';

export interface RemoveButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const RemoveButton: FC<RemoveButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton mode={CustomButtonMode.icon} type="text" {...props} icon={<DeleteOutlined />} ref={ref}>
      {children}
    </CustomButton>
  );
});

export default RemoveButton;

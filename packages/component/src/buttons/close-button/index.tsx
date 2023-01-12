import { CloseOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';


export interface CloseButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const CloseButton: FC<CloseButtonProps> = forwardRef(
  ({ children, ...restProps }, ref) => {
    return (
      <CustomButton title="关闭" {...restProps} icon={<CloseOutlined />} ref={ref}>
        {children}
      </CustomButton>
    );
  },
);

export default CloseButton;

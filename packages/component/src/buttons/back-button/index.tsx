import { RollbackOutlined } from '@ant-design/icons';
import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';

export interface BackButtonProps extends Omit<CustomButtonProps, 'icon'> {}

const BackButton: FC<BackButtonProps> = forwardRef(({ children, onClick, ...restProps }, ref) => {
  const handleBackClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    history.back();
  };

  return (
    <CustomButton
      title="返回"
      {...restProps}
      onClick={handleBackClick}
      icon={<RollbackOutlined />}
      ref={ref}
    >
      {children}
    </CustomButton>
  );
});

export default BackButton;

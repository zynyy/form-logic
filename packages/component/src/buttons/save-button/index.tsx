import { SaveOutlined } from '@ant-design/icons';

import { FC, forwardRef } from 'react';
import CustomButton, { CustomButtonProps } from '@/buttons/custom-button';

export interface SaveButtonProps extends CustomButtonProps {}

const SaveButton: FC<SaveButtonProps> = forwardRef(({ children, ...props }, ref) => {
  return (
    <CustomButton title="保存" type="primary" {...props} icon={<SaveOutlined />} ref={ref}>
      {children}
    </CustomButton>
  );
});

export default SaveButton;

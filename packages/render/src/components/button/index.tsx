import { FC } from 'react';
import { Button, ButtonProps } from 'antd';

interface BtnProps extends ButtonProps {}

const Btn: FC<BtnProps> = ({ title, ...btnProps }) => {
  console.log(btnProps, 88);
  return (
    <Button {...btnProps} type="dashed" title={title}>
      {title}
    </Button>
  );
};

export default Btn;

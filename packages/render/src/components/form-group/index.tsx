import { FC, PropsWithChildren } from 'react';
import { Card } from 'antd';

import cn from 'classnames';

interface FormGroupProps extends PropsWithChildren {
  code?: string;
  title?: string;
  className?: string;
  hiddenName?: boolean;
}

export const FormGroup: FC<FormGroupProps> = ({ children, code, hiddenName, className, title }) => {
  return (
    <Card id={code} className={cn('form-group', className)} title={hiddenName ? null : title}>
      {children}
    </Card>
  );
};

export default FormGroup;

import { FC, PropsWithChildren } from 'react';
import { Card, Space } from 'antd';

import cn from 'classnames';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import useGroupSchemaBtn from '@/components/hooks/useGroupSchemaBtn';

export interface FormGroupProps extends PropsWithChildren {
  code?: string;
  title?: string;
  className?: string;
  hiddenName?: boolean;
}

const FormGroup: FC<FormGroupProps> = ({ code, hiddenName, className, title }) => {
  const schema = useFieldSchema();
  const field = useField();

  const btn = useGroupSchemaBtn();

  const filterProperties = (propertiesSchema) => {
    return propertiesSchema.name !== 'groupButtons';
  };

  return (
    <Card
      id={code}
      size="small"
      className={cn('form-group', className)}
      title={hiddenName ? null : title}
      extra={btn ? <Space>{btn}</Space> : null}
    >
      <RecursionField
        basePath={field.address}
        schema={schema}
        onlyRenderProperties
        filterProperties={filterProperties}
      />
    </Card>
  );
};

export default FormGroup;

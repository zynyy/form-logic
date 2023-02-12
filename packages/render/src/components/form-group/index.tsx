import { FC, PropsWithChildren } from 'react';
import { Card, Space } from 'antd';

import { RecursionField, useField, useFieldSchema } from '@formily/react';
import {useGroupSchemaBtn} from '@/hooks';
import { useFormGroupStyle } from '@/components/form-group/hooks';
import cls from 'classnames';

export interface FormGroupProps extends PropsWithChildren {
  code?: string;
  title?: string;
  className?: string;
  hiddenName?: boolean;
}

const FormGroup: FC<FormGroupProps> = ({ code, hiddenName, className, title }) => {
  const schema = useFieldSchema();
  const field = useField();

  const btn = useGroupSchemaBtn(code);

  const [warpSSR, hashId, prefixCls] = useFormGroupStyle();

  const filterProperties = (propertiesSchema) => {
    return propertiesSchema.name !== 'groupButtons';
  };

  return warpSSR(
    <Card
      id={code}
      size="small"
      className={cls(hashId, prefixCls, className)}
      title={hiddenName ? null : title}
      extra={btn ? <Space>{btn}</Space> : null}
    >
      <RecursionField
        basePath={field.address}
        schema={schema}
        onlyRenderProperties
        filterProperties={filterProperties}
      />
    </Card>,
  );
};

export default FormGroup;

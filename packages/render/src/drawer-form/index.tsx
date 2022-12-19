import { Drawer, DrawerProps, Spin } from 'antd';
import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useState } from 'react';
import { useFormSchema } from '@/hooks';
import { TransformsSchemaOptions } from '@/transforms';

export interface DrawerFormProps extends DrawerProps, SchemeFormProps {
  options: TransformsSchemaOptions;
}

const DrawerForm: FC<DrawerFormProps> = ({ open, formConfig, options, onClose }) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const { schema } = useFormSchema(options);

  return (
    <Drawer open={open} onClose={onClose} width="90%" maskClosable={false}>
      <Spin spinning={submitLoading}>
        <SchemeForm schema={schema} formConfig={formConfig} />
      </Spin>
    </Drawer>
  );
};

export default DrawerForm;

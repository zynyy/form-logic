import SchemaLayout from '@/components/schema-layout/SchemaLayout';
import SchemeForm from '@/scheme-form';
import { FC, useRef, useState } from 'react';
import { Skeleton, Spin } from 'antd';
import { ISchema } from '@formily/json-schema';
import LeftRightSlot from '@/components/left-right-slot';

interface FormNormalProps {}

const FormNormal: FC<FormNormalProps> = () => {
  const [schema, setSchema] = useState<ISchema | undefined>(undefined);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [loading] = useState(false);

  const formRef = useRef();

  return (
    <Spin>
      <SchemaLayout footer={<LeftRightSlot />}>
        <SchemeForm schema={schema} ref={formRef} />
      </SchemaLayout>
    </Spin>
  );
};

export default FormNormal;

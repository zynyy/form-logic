import { Modal, ModalProps, Skeleton, Spin } from 'antd';
import SchemeForm from '@/scheme-form';
import { useState } from 'react';
import { ISchema } from '@formily/json-schema';


export interface ModalFormProps extends ModalProps{

}

const ModalForm = () => {
  const [schema, setSchema] = useState<ISchema | undefined>(undefined);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [loading] = useState(false);

  return (
    <Modal>
      <Skeleton loading={loading}>
        <Spin spinning={submitLoading}>
          <SchemeForm schema={schema} />
        </Spin>
      </Skeleton>
    </Modal>
  );
};

export default ModalForm;

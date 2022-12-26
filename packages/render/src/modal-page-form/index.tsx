import { Button, message, Modal, ModalProps, Skeleton, Spin } from 'antd';
import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useState } from 'react';

import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig } from '@/interface';
import {
  useBindBtnClick,
  useBindLogic,
  useCreateForm,
  useFormSchema,
  useTriggerLogic,
} from '@/hooks';
import { getSubmitFormValues } from '@/utils/getSubmitFormValues';
import * as React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { flushSync } from 'react-dom';
import LeftRightSlot from '@/components/left-right-slot';

export interface ModalPageFormProps
  extends Omit<ModalProps, 'onCancel' | 'onOk'>,
    Pick<SchemeFormProps, 'onFormMount' | 'formConfig' | 'components'> {
  options: TransformsSchemaOptions;
  getLogicConfig?: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
  validateFormValues?: (formValues: any) => Promise<string>;
  onConfirm?: (formValues: any) => void;
  onClose?: (e: React.MouseEvent) => void;
}

const ModalPageForm: FC<ModalPageFormProps> = ({
  formConfig,
  onFormMount,
  options,
  getLogicConfig,
  events,
  extraLogicParams,
  onConfirm,
  onClose,
  validateFormValues,
  open,
  title,
  components,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const { schema, buttons, logicList, btnFields } = useFormSchema(options);

  const [form] = useCreateForm(formConfig, onFormMount);

  useBindBtnClick(form, btnFields, getLogicConfig, extraLogicParams, events, () => {});

  const [done] = useBindLogic(form, schema, logicList, getLogicConfig, extraLogicParams, () => {});

  const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {
    setSubmitLoading(false);
  });

  const handleCloseClick = (e) => {
    form.reset();

    onClose?.(e);
  };

  const submit = (formValues: any) => {
    onConfirm?.(formValues);

    setSubmitLoading(false);
  };

  const handleConfirmClick = () => {
    setSubmitLoading(true);

    getSubmitFormValues(form)
      .then((formValues) => {
        if (validateFormValues) {
          validateFormValues(formValues)
            .then(() => {
              submit(formValues);
            })
            .catch((err) => {
              setSubmitLoading(false);
              if (err) {
                message.warning(err).then(() => void 0);
              }
            });
        } else {
          submit(formValues);
        }
      })
      .catch(() => {
        setSubmitLoading(false);
      });
  };

  const renderFooter = () => {
    const left = (
      <Button loading={submitLoading} icon={<CloseOutlined />} onClick={handleCloseClick}>
        关闭
      </Button>
    );

    const right = buttons.map((item) => {
      const { name, logics, eventCode } = item || {};

      const clickCodes =
        logics?.filter((item) => item.event === 'onClick')?.map((item) => item.logicCode) || [];

      return (
        <Button
          loading={submitLoading}
          disabled={submitLoading}
          key={name}
          onClick={(e) => {
            if (events?.[eventCode]) {
              events[eventCode](e, form, setSubmitLoading);
              return;
            }

            if (clickCodes.length) {
              flushSync(() => {
                setSubmitLoading(true);
              });

              triggerLogic(clickCodes, {
                params: extraLogicParams,
                form,
              });
            }
          }}
        >
          {name}
        </Button>
      );
    });

    return (
      <LeftRightSlot
        left={left}
        right={
          <>
            {right}
            <Button
              loading={submitLoading}
              disabled={submitLoading}
              onClick={handleConfirmClick}
              type="primary"
              icon={<CheckOutlined />}
              key="confirmBtn"
            >
              确定
            </Button>
          </>
        }
      />
    );
  };

  return (
    <Modal
      title={title || '请填写'}
      maskClosable={false}
      open={open}
      confirmLoading={submitLoading}
      onOk={handleConfirmClick}
      onCancel={handleCloseClick}
      closable={false}
      bodyStyle={{
        overflowY: 'auto',
        maxHeight: 500,
      }}
      footer={renderFooter()}
    >
      <Spin spinning={submitLoading}>
        <SchemeForm
          form={form}
          done={done}
          schema={schema}
          formConfig={formConfig}
          components={components}
        />
      </Spin>
    </Modal>
  );
};

export default ModalPageForm;

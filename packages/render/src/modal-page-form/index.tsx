import { Button, message, Space } from 'antd';
import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useEffect, useState, MouseEvent, useRef } from 'react';

import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig } from '@/interface';
import { usePageForm, useTriggerLogic } from '@/hooks';

import { CheckOutlined } from '@ant-design/icons';

import {
  PageLoading,
  LeftRightSlot,
  CloseButton,
  DraggableModal,
  DraggableModalProps,
} from '@formlogic/component';
import { getSubmitFormValues } from '@/utils/formUtils';
import { Form, IFormProps } from '@formily/core';

export interface ModalPageFormProps
  extends Omit<DraggableModalProps, 'onCancel' | 'onOk'>,
    Pick<SchemeFormProps, 'language' | 'components'> {
  options: TransformsSchemaOptions;
  getLogicConfig?: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
  validateFormValues?: (formValues: any) => Promise<string>;
  onConfirm?: (formValues: any) => void;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  onFormMount?: (form: Form) => void;
  formConfig?: IFormProps;
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
  width,
  language,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const { schema, buttons, form, formLoading, pattern,refreshForm } = usePageForm({
    formConfig,
    onFormMount,
    options,
    getLogicConfig,
    logicParams: extraLogicParams,
    events,
  });

  const nextFormId = useRef<string>(form.id);

  const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {
    setSubmitLoading(false);
  });

  const handleCloseClick = (e) => {
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
    const left = <CloseButton loading={submitLoading} onClick={handleCloseClick} />;

    const right = buttons.map((item) => {
      const { name, logics, eventCode } = item || {};

      const clickCodes =
        logics?.filter((item) => item.effectHook === 'onClick')?.map((item) => item.logicCode) ||
        [];

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
              setSubmitLoading(true);

              triggerLogic(clickCodes, {
                params: extraLogicParams,
                form,
                effectHook: 'onClick',
                fieldCode: name,
                pageCode: options?.metaSchema?.code,
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
          <Space>
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
          </Space>
        }
      />
    );
  };

  useEffect(() => {
    if (open) {
      setSubmitLoading(false);
      nextFormId.current = refreshForm(formConfig);
    }
  }, [open, formConfig]);

  useEffect(() => {
    nextFormId.current = form?.id;
  }, [form?.id]);

  return (
    <DraggableModal
      title={title || '请填写'}
      maskClosable={false}
      open={open}
      confirmLoading={submitLoading}
      onOk={handleConfirmClick}
      onCancel={handleCloseClick}
      closable={false}
      width={width || '60%'}
      bodyStyle={{
        overflowY: 'auto',
        maxHeight: 500,
      }}
      footer={renderFooter()}
    >
      <PageLoading loading={submitLoading}>
        <SchemeForm
          form={form}
          loading={formLoading && nextFormId.current !== form.id}
          schema={schema}
          components={components}
          pattern={pattern}
          getLogicConfig={getLogicConfig}
          events={events}
          extraLogicParams={extraLogicParams}
          language={language}
        />
      </PageLoading>
    </DraggableModal>
  );
};

export default ModalPageForm;

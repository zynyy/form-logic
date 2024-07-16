import { message } from 'antd';
import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useEffect, useState, MouseEvent, useMemo } from 'react';

import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig, SchemaPatternEnum } from '@/interface';
import { usePageForm, useTriggerLogic } from '@/hooks';

import { PageLoading, DraggableModal, DraggableModalProps } from '@formlogic/component';
import { getSubmitFormValues } from '@/utils/formUtils';
import { Form, IFormProps } from '@formily/core';
import { ClickRecord } from '@/components/buttons';
import DrawerModalFooter from '@/components/drawer-modal-footer';

export interface ModalPageFormProps
  extends Omit<DraggableModalProps, 'onCancel' | 'onOk'>,
    Pick<SchemeFormProps, 'language' | 'components'> {
  options: TransformsSchemaOptions;
  getLogicConfig: LogicConfig;
  formConfig?: IFormProps;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
  validateFormValues?: (formValues: any) => Promise<string>;
  onConfirm?: (formValues: any) => void;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  onFormMount?: (form: Form) => void;
  hasConfirmButton?: boolean;
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
  hasConfirmButton,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const { schema, buttons, form, formLoading, pattern, refreshForm } = usePageForm({
    formConfig,
    onFormMount,
    options,
    getLogicConfig,
    logicParams: extraLogicParams,
    events,
    autoRefreshForm: false,
  });

  const [loadingDone, setLoadingDone] = useState(false);

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

  const handleButtonItemClick = (e, record: ClickRecord) => {
    const { eventCode, clickCodes, code } = record;

    if (events?.[eventCode]) {
      return events[eventCode](e, {
        form,
        setSubmitLoading,
        code,
      });
    }

    if (clickCodes.length) {
      setSubmitLoading(true);

      triggerLogic(clickCodes, {
        params: extraLogicParams,
        form,
        effectHook: 'onClick',
        fieldCode: code,
        pageCode: options?.metaSchema?.code,
      });
    }
  };

  const loading = useMemo(() => {
    return formLoading || !open || !loadingDone;
  }, [formLoading, open, loadingDone]);

  useEffect(() => {
    if (open) {
      setSubmitLoading(false);
      refreshForm(formConfig);
    }
  }, [open, formConfig]);

  const handleAfterClose = () => {
    setLoadingDone(false);
  };

  useEffect(() => {
    let timer = null;

    if (open) {
      timer = requestIdleCallback(
        () => {
          setLoadingDone(true);
        },
        { timeout: 1000 },
      );
    }

    return () => {
      cancelIdleCallback(timer);
    };
  }, [open]);

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
        minHeight: 200,
      }}
      footer={
        <DrawerModalFooter
          buttons={buttons}
          hasConfirmButton={hasConfirmButton ?? options?.pattern !== SchemaPatternEnum.DETAIL}
          onClick={handleButtonItemClick}
          onConfirmClick={handleConfirmClick}
          onCloseCLick={handleCloseClick}
          loading={submitLoading}
          disabled={submitLoading}
          components={components}
        />
      }
      destroyOnClose
      afterClose={handleAfterClose}
    >
      <PageLoading loading={submitLoading}>
        <SchemeForm
          form={form}
          loading={loading}
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

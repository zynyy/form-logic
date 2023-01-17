import { Drawer, DrawerProps, message } from 'antd';
import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useEffect, useMemo, useState } from 'react';
import { usePageForm, useTriggerLogic } from '@/hooks';
import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig, SchemaPatternEnum } from '@/interface';

import { PageLoading } from '@formlogic/component';

import { getSubmitFormValues } from '@/utils/formUtils';
import { Form, IFormProps } from '@formily/core';
import { ClickRecord } from '@/components/buttons';
import DrawerModalFooter from '@/components/drawer-modal-footer';

export interface DrawerPageFormProps
  extends DrawerProps,
    Pick<SchemeFormProps, 'language' | 'components'> {
  options: TransformsSchemaOptions;
  getLogicConfig?: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
  onConfirm?: (formValues: any) => void;
  onClose?: () => void;
  validateFormValues?: (formValues: any) => Promise<string>;
  onFormMount?: (form: Form) => void;
  formConfig?: IFormProps;
  hasConfirmButton?: boolean;
}

const DrawerPageForm: FC<DrawerPageFormProps> = ({
  open,
  events,
  formConfig,
  onFormMount,
  options,
  onClose,
  onConfirm,
  getLogicConfig,
  extraLogicParams,
  title,
  components,
  validateFormValues,
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

  const handleCloseClick = () => {
    onClose?.();
  };

  const submit = (formValues: any) => {
    onConfirm?.(formValues);

    setSubmitLoading(false);

    handleCloseClick();
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

  useEffect(() => {
    if (open) {
      setSubmitLoading(false);
      refreshForm(formConfig);
    }
  }, [open, formConfig]);

  const handleButtonItemClick = (e, record: ClickRecord) => {
    const { eventCode, clickCodes, code } = record;

    if (events?.[eventCode]) {
      events[eventCode](e, {
        form,
        setSubmitLoading,
        code,
      });
      return;
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

  return (
    <Drawer
      open={open}
      title={title || '请填写'}
      onClose={handleCloseClick}
      width="90%"
      maskClosable={false}
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
      closable={false}
      destroyOnClose
      afterOpenChange={setLoadingDone}
    >
      <PageLoading loading={submitLoading}>
        <SchemeForm
          form={form}
          loading={loading}
          schema={schema}
          pattern={pattern}
          components={components}
          getLogicConfig={getLogicConfig}
          events={events}
          extraLogicParams={extraLogicParams}
          language={language}
        />
      </PageLoading>
    </Drawer>
  );
};

export default DrawerPageForm;

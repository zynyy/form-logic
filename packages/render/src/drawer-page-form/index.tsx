import { Button, Drawer, DrawerProps, message, Space } from 'antd';
import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useEffect, useMemo, useState } from 'react';
import { usePageForm, useTriggerLogic } from '@/hooks';
import { TransformsSchemaOptions } from '@/transforms';
import { AnyObject, EventsObject, LogicConfig } from '@/interface';
import { CheckOutlined } from '@ant-design/icons';

import { CloseButton, LeftRightSlot, PageLoading } from '@formlogic/component';

import { getSubmitFormValues } from '@/utils/formUtils';
import { Form, IFormProps } from '@formily/core';

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
    refreshForm({});
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

  const renderFooter = () => {
    const left = <CloseButton loading={submitLoading} onClick={handleCloseClick} />;

    const right = buttons.map((item) => {
      const { name, logics, eventCode } = item || {};

      const clickCodes =
        logics?.filter((item) => item.effectHook === 'onClick')?.map((item) => item.logicCode) ||
        [];

      // todo 待优化
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
      footer={renderFooter()}
      closable={false}
      destroyOnClose
      afterOpenChange={(open) => {
        if (open) {
          setLoadingDone(true);
        } else {
          setLoadingDone(false);
        }
      }}
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

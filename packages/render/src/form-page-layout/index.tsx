import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useState, useEffect } from 'react';
import { Button } from 'antd';

import { TransformsOptionsArgs, usePageForm, useTransformsOptions, useTriggerLogic } from '@/hooks';
import { AnyObject, EventsObject, LogicConfig } from '@/interface';

import { LeftRightSlot, BackButton, Layout } from '@formlogic/component';
import { Form, IFormProps } from '@formily/core';

export interface FormPageLayoutProps
  extends TransformsOptionsArgs,
    Pick<SchemeFormProps, 'language' | 'components'> {
  formConfig?: IFormProps;
  onFormMount?: (form: Form) => void;
  getLogicConfig: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
  hasBackBtn?: boolean;
  hasFooter?: boolean;
  hasButton?: boolean;
  loading?: boolean;
  onBackClick?: (e) => void;
}

const FormPageLayout: FC<FormPageLayoutProps> = ({
  pageCode,
  metaSchema,
  hasGroup,
  pattern,
  onFormMount,
  formConfig,
  getLogicConfig,
  extraLogicParams,
  events,
  hasFooter,
  hasBackBtn,
  hasButton,
  onBackClick,
  components,
  loading,
  language,
}) => {
  const [options] = useTransformsOptions({
    pageCode,
    metaSchema,
    hasGroup,
    pattern,
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const { schema, buttons, form, formLoading } = usePageForm({
    formConfig,
    onFormMount,
    autoRefreshForm: true,
    options,
    getLogicConfig,
    logicParams: extraLogicParams,
    events,
  });

  const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {
    setSubmitLoading(false);
  });

  useEffect(() => {
    setSubmitLoading(!!loading);
  }, [loading]);

  const renderFooter = () => {
    if (hasFooter) {
      const left = hasBackBtn ? <BackButton onClick={onBackClick} /> : null;

      const right = hasButton
        ? buttons.map((item) => {
            const { name, logics, eventCode } = item || {};

            const clickCodes =
              logics
                ?.filter((item) => item.effectHook === 'onClick')
                ?.map((item) => item.logicCode) || [];

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
          })
        : null;

      return <LeftRightSlot left={left} right={right} />;
    }

    return null;
  };

  return (
    <Layout loading={submitLoading} footer={renderFooter()}>
      <SchemeForm
        loading={formLoading}
        form={form}
        schema={schema}
        components={components}
        pattern={pattern}
        getLogicConfig={getLogicConfig}
        extraLogicParams={extraLogicParams}
        events={events}
        language={language}
      />
    </Layout>
  );
};

FormPageLayout.defaultProps = {
  hasFooter: true,
  hasBackBtn: true,
  hasButton: true,
};

export default FormPageLayout;

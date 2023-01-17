import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useState, useEffect } from 'react';

import { TransformsOptionsArgs, usePageForm, useTransformsOptions, useTriggerLogic } from '@/hooks';
import { AnyObject, EventsObject, LogicConfig } from '@/interface';

import { LeftRightSlot, BackButton, Layout } from '@formlogic/component';
import { Form, IFormProps } from '@formily/core';
import Buttons, { ClickRecord } from '@/components/buttons';

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

  const handleButtonItemClick = (e, record: ClickRecord) => {
    const { eventCode, clickCodes, code } = record;

    if (events?.[eventCode]) {
      return events[eventCode](e, {
        code,
        form,
        setSubmitLoading,
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

  const renderFooter = () => {
    if (hasFooter) {
      const left = hasBackBtn ? <BackButton onClick={onBackClick} /> : null;

      return (
        <LeftRightSlot
          left={left}
          right={
            <Buttons
              buttons={buttons}
              loading={submitLoading}
              disabled={submitLoading}
              onClick={handleButtonItemClick}
              components={components}
            />
          }
        />
      );
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

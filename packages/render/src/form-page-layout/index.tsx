import SchemaLayout from '@/components/schema-layout/SchemaLayout';
import SchemeForm, { SchemeFormProps } from '@/scheme-form';
import { FC, useState, MouseEvent } from 'react';
import { Button, Spin } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import LeftRightSlot from '@/components/left-right-slot';
import {
  TransformsOptionsArgs,
  useBindBtnClick,
  useBindLogic,
  useCreateForm,
  useFormSchema,
  useTransformsOptions,
  useTriggerLogic,
} from '@/hooks';
import { AnyObject, EventsObject, LogicConfig } from '@/interface';

import { flushSync } from 'react-dom';

export interface FormPageLayoutProps
  extends TransformsOptionsArgs,
    Pick<SchemeFormProps, 'onFormMount' | 'formConfig' | 'components'> {
  getLogicConfig: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
  hasBackBtn?: boolean;
  hasFooter?: boolean;
  hasButton?: boolean;
  onBackClick?: (e: MouseEvent<HTMLElement>) => void;
}

const FormPageLayout: FC<FormPageLayoutProps> = ({
  pageCode,
  metaSchema,
  hasGroup,
  schemaMode,
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
}) => {
  const [options] = useTransformsOptions({
    pageCode,
    metaSchema,
    hasGroup,
    schemaMode,
  });

  const { schema, logicList, btnFields, buttons } = useFormSchema(options);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [form] = useCreateForm(formConfig, onFormMount);

  useBindBtnClick(form, btnFields, getLogicConfig, extraLogicParams, events, () => {});

  const [done] = useBindLogic(form, schema, logicList, getLogicConfig, extraLogicParams, () => {});

  const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {
    setSubmitLoading(false);
  });

  const handleBackClick = (e: MouseEvent<HTMLElement>) => {
    if (onBackClick) {
      onBackClick(e);
      return;
    }
    history.back();
  };

  const renderFooter = () => {
    if (hasFooter) {
      const left = hasBackBtn ? (
        <Button icon={<RollbackOutlined />} onClick={handleBackClick}>
          返回
        </Button>
      ) : null;

      const right = hasButton
        ? buttons.map((item) => {
            const { name, logics, eventCode } = item || {};

            const clickCodes =
              logics?.filter((item) => item.event === 'onClick')?.map((item) => item.logicCode) ||
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
          })
        : null;

      return <LeftRightSlot left={left} right={right} />;
    }

    return null;
  };

  return (
    <Spin spinning={submitLoading}>
      <SchemaLayout footer={renderFooter()}>
        <SchemeForm done={done} form={form} schema={schema} components={components} />
      </SchemaLayout>
    </Spin>
  );
};

FormPageLayout.defaultProps = {
  hasFooter: true,
  hasBackBtn: true,
  hasButton: true,
};

export default FormPageLayout;

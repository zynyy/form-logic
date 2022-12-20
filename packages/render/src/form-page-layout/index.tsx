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
} from '@/hooks';
import { AnyObject, EventsObject, LogicConfig } from '@/interface';
import ExecLogic from '@/exec-logic';

interface FormNormalProps
  extends TransformsOptionsArgs,
    Pick<SchemeFormProps, 'onMount' | 'formConfig'> {
  getLogicConfig: LogicConfig;
  extraLogicParams?: AnyObject;
  events?: EventsObject;
  hasBackBtn?: boolean;
  hasFooter?: boolean;
  hasButton?: boolean;
  onBackClick?: (e: MouseEvent<HTMLElement>) => void;
}

const FormPageLayout: FC<FormNormalProps> = ({
  pageCode,
  metaSchema,
  hasGroup,
  schemaMode,
  onMount,
  formConfig,
  getLogicConfig,
  extraLogicParams,
  events,
  hasFooter,
  hasBackBtn,
  hasButton,
  onBackClick,
}) => {
  const [options] = useTransformsOptions({
    pageCode,
    metaSchema,
    hasGroup,
    schemaMode,
  });

  const { schema, logicList, btnFields, buttons } = useFormSchema(options);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [form] = useCreateForm(formConfig, onMount);

  useBindBtnClick(form, btnFields, getLogicConfig, extraLogicParams, events, () => {});

  const [done] = useBindLogic(form, schema, logicList, getLogicConfig, extraLogicParams, () => {});

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

            return (
              <Button
                loading={submitLoading}
                disabled={submitLoading}
                onClick={(e) => {
                  if (events?.[eventCode]) {
                    events[eventCode](e, form);
                    return;
                  }

                  setSubmitLoading(true);
                  logics.forEach((cur) => {
                    const { event, logicCode } = cur || {};

                    if (event === 'onClick') {
                      getLogicConfig(logicCode).then((result) => {
                        if (result) {
                          const execLogic = new ExecLogic(
                            result.default,
                            {
                              params: extraLogicParams,
                              form,
                            },
                            () => {
                              setSubmitLoading(false);
                            },
                          );
                          execLogic.run().then(() => void 0);
                        }
                      });
                    }
                  });
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
        <SchemeForm done={done} form={form} schema={schema} />
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

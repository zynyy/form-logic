import { computed, defineComponent, ref, watch } from 'vue';

import DraggableModal from '@/components/draggable-modal';
import DrawerModalFooter from '@/components/drawer-modal-footer';
import { SchemaPatternEnum } from '@/interface';
import SchemeForm from '@/scheme-form';
import PageLoading from '@/components/page-loading';
import { usePageForm } from '@/hooks';
import { useTriggerLogic } from '@/hooks/useLogic';
import { ClickRecord } from '@/components/buttons';
import { getModalPageFormProps, ModalPageFormProps } from './interface';
import { getSubmitFormValues } from '@/utils/formUtils';

import { message } from 'ant-design-vue';

const ModalPageForm = defineComponent({
  name: 'ModalPageForm',
  inheritAttrs: false,
  props: getModalPageFormProps(),
  setup(props: ModalPageFormProps) {
    const submitLoading = ref(false);

    const loadingDone = ref(false);

    const [triggerLogic] = useTriggerLogic(props.getLogicConfig, () => {
      submitLoading.value = false;
    });

    const setSubmitLoading = (nextSubmitLoading: boolean) => {
      submitLoading.value = nextSubmitLoading;
    };

    const pageFormArgsRef = computed(() => {
      const { formConfig, onFormMount, getLogicConfig, events, extraLogicParams, options } = props;

      return {
        formConfig,
        onFormMount,
        options,
        getLogicConfig,
        logicParams: extraLogicParams,
        events,
        autoRefreshForm: false,
      };
    });

    const pageFormRef = usePageForm(pageFormArgsRef);

    const submit = (formValues: any) => {
      const { onConfirm } = props;

      onConfirm?.(formValues);

      submitLoading.value = false;
      handleCloseClick();
    };

    const handleConfirmClick = () => {
      const { form } = pageFormRef.value;

      const { validateFormValues } = props;
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

    const handleCloseClick = (e?: MouseEvent) => {
      const { onClose } = props;

      onClose?.(e);
    };

    const handleAfterClose = () => {
      loadingDone.value = false;
    };

    const handleButtonItemClick = (e, record: ClickRecord) => {
      const { eventCode, clickCodes, code } = record;

      const { events, extraLogicParams, options } = props;

      const { form } = pageFormRef.value;

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

    const renderFooter = () => {
      const { buttons } = pageFormRef.value;

      const { components, hasConfirmButton, options } = props;

      return (
        <DrawerModalFooter
          buttons={buttons}
          hasConfirmButton={hasConfirmButton ?? options?.pattern !== SchemaPatternEnum.DETAIL}
          onClick={handleButtonItemClick}
          onConfirmClick={handleConfirmClick}
          onCloseCLick={handleCloseClick}
          loading={submitLoading.value}
          disabled={submitLoading.value}
          components={components}
        />
      );
    };

    let timer = null;

    watch(
      () => {
        return {
          formConfig: props.formConfig,
          visible: props.visible,
        };
      },
      () => {
        if (props.visible) {
          const { refreshForm } = pageFormRef.value;
          refreshForm(props.formConfig);
        }
      },
    );

    watch(
      () => props.visible,
      (nextVisible) => {
        setSubmitLoading(false);
        clearTimeout(timer);
        if (nextVisible) {
          timer = setTimeout(() => {
            loadingDone.value = true;
          }, 100);
        }
      },
    );

    return () => {
      const {
        components,
        title,
        width,
        extraLogicParams,
        getLogicConfig,
        events,
        visible,
        language,
      } = props;

      const { schema, form, pattern, formLoading } = pageFormRef.value;

      const loading = formLoading || !visible || !loadingDone.value;

      return (
        <DraggableModal
          title={title || '请填写'}
          maskClosable={false}
          visible={visible}
          confirmLoading={submitLoading.value}
          onOk={handleConfirmClick}
          onCancel={handleCloseClick}
          closable={false}
          width={width || '60%'}
          bodyStyle={{
            overflowY: 'auto',
            maxHeight: 500,
            minHeight: 200,
          }}
          v-slots={{
            footer: renderFooter,
          }}
          destroyOnClose
          afterClose={handleAfterClose}
        >
          <PageLoading loading={submitLoading.value}>
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
  },
});

export default ModalPageForm;

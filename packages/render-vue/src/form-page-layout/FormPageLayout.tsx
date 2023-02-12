import { computed, defineComponent, ref, toRef, VNode } from 'vue';
import SchemeForm from '@/scheme-form';
import Layout from '@/components/layout';

import { FormPageLayoutProps, getFormPageLayoutProps } from './interface';
import { usePageForm } from '@/hooks';
import { useTransformsOptions } from '@/hooks/useTransformsOptions';
import Buttons, { ClickRecord } from '@/components/buttons';
import { useTriggerLogic } from '@/hooks/useLogic';
import BackButton from '@/components/buttons/BackButton';
import LeftRightSlot from '@/components/left-right-slot';

const FormPageLayout = defineComponent({
  name: 'FormPageLayout',
  props: getFormPageLayoutProps(),
  inheritAttrs: false,
  setup(props: FormPageLayoutProps) {
    const submitLoading = ref(false);

    const pageCodeRef = toRef(props, 'pageCode');
    const metaSchemaRef = toRef(props, 'metaSchema');
    const hasGroupRef = toRef(props, 'hasGroup');
    const patternRef = toRef(props, 'pattern');

    const { options } = useTransformsOptions({
      pageCode: pageCodeRef,
      metaSchema: metaSchemaRef,
      hasGroup: hasGroupRef,
      pattern: patternRef,
    });

    const pageFormArgsRef = computed(() => {
      const { formConfig, onFormMount, getLogicConfig, events, extraLogicParams } = props;
      return {
        formConfig,
        onFormMount,
        autoRefreshForm: true,
        options: options.value,
        getLogicConfig,
        logicParams: extraLogicParams,
        events,
      };
    });

    const pageFormRef = usePageForm(pageFormArgsRef);

    const [triggerLogic] = useTriggerLogic(props.getLogicConfig, () => {

      setSubmitLoading(false);
    });

    const setSubmitLoading = (nextLoading: boolean) => {
      submitLoading.value = nextLoading;
    };
    const handleButtonItemClick = (e, record: ClickRecord) => {
      const { eventCode, clickCodes, code } = record;
      const { form } = pageFormRef.value;

      const { events, extraLogicParams } = props;

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
          pageCode: options.value?.metaSchema?.code,
        });
      }
    };

    return () => {
      const {
        hasFooter,
        hasBackBtn,
        hasButton,
        onBackClick,
        extraLogicParams,
        getLogicConfig,
        events,
        language,
        components,
      } = props;

      const { buttons, form, formLoading, schema, pattern } = pageFormRef.value;

      const renderFooter = () => {
        if (hasFooter) {
          const slots: Record<string, () => VNode> = {};

          if (hasBackBtn) {
            slots.left = () => <BackButton onClick={onBackClick} />;
          }

          if (hasButton) {
            slots.right = () => (
              <Buttons
                buttons={buttons}
                loading={submitLoading.value}
                disabled={submitLoading.value}
                onClick={handleButtonItemClick}
                components={components}
              />
            );
          }

          return <LeftRightSlot v-slots={slots} />;
        }

        return null;
      };

      return (
        <Layout
          loading={submitLoading.value}
          v-slots={{
            footer: renderFooter,
          }}
        >
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
  },
});

export default FormPageLayout;

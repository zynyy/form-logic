import {
  clone,
  IFormProps,
  SchemaPatternEnum,
  useSchemaComponentsContext,
} from '@formlogic/render-core-vue2';
import { merge } from 'lodash-es';
import { h, ref, watch, watchEffect } from 'vue';

import { DrawerEvent, FormDrawerProps } from '@/hooks/drawer/interface';
import { useJsonMetaSchema } from '@/hooks/useJsonMetaSchema';
import { useOpen } from '@/hooks/useOpen';
import { useSchemeFormContent } from '@/renderer-layout/scheme-form/hooks';
import { TransformsSchemaOptions } from '@/transforms';

const useFormDrawer = (props: FormDrawerProps, event: DrawerEvent) => {
  const [visible, openDrawer, closeDrawer] = useOpen();

  const DrawerPageForm = 'DrawerPageForm';

  const pageCode = ref<string>('');

  const isRenderDrawer = ref(false);

  const { metaSchema } = useJsonMetaSchema(pageCode);

  const formDrawerConfig = ref<IFormProps>({});

  const componentsRef = useSchemaComponentsContext();

  const formContentRef = useSchemeFormContent();

  const extraLogicParams = ref({});

  const setDrawerExtraLogicParams = (nextExtraLogicParams: Record<string, any>) => {
    extraLogicParams.value = nextExtraLogicParams;
  };

  const getDrawerOptions = (transformsSchemaOptions?: Partial<TransformsSchemaOptions>) => {
    return merge(
      clone({
        metaSchema: metaSchema.value,
        hasGroup: true,
        pattern: SchemaPatternEnum.EDITABLE,
      }),
      transformsSchemaOptions,
    );
  };

  const options = ref<TransformsSchemaOptions>(getDrawerOptions());

  const setDrawerOptions = (transformsSchemaOptions?: Partial<TransformsSchemaOptions>) => {
    options.value = getDrawerOptions(transformsSchemaOptions);
  };

  const setDrawerFormConfig = (formConfig?: Partial<IFormProps>) => {
    const { drawerFormConfig } = props;
    formDrawerConfig.value = {
      ...drawerFormConfig,
      ...formConfig,
    };
  };

  const handleClose = () => {
    closeDrawer();
  };

  const handleConfirm = (formValues: Record<string, any>) => {
    if (event?.confirm) {
      event.confirm(formValues);
    }
  };

  watch(
    () => {
      return {
        visible: visible.value,
        pageCode: props.drawerPageCode,
      };
    },
    () => {
      if (visible.value) {
        pageCode.value = props.drawerPageCode;
      }
    },
  );

  watch(metaSchema, () => {
    options.value = merge({}, options.value, {
      metaSchema: metaSchema.value,
    });
  });

  watchEffect(() => {
    if (visible.value && !isRenderDrawer.value) {
      isRenderDrawer.value = true;
    }
  });

  const renderFormDrawerDom = () => {
    const {
      drawerDetailApiConfig,
      drawerValidateFormValues,
      drawerTitle,
      drawerExtraLogicParams,
      hasConfirmButton,
    } = props;

    const { getLogicConfig } = formContentRef.value;

    return h(DrawerPageForm, {
      attrs: {
        visible: visible.value && isRenderDrawer.value,
        options: options.value,
        title: drawerTitle,
        width: '80%',
        formConfig: formDrawerConfig.value,
        getLogicConfig,
        detailApiConfig: drawerDetailApiConfig,
        validateFormValues: drawerValidateFormValues,
        extraLogicParams: {
          ...drawerExtraLogicParams,
          ...extraLogicParams.value,
          closeDrawer: handleClose,
          reRequest: event?.reRequest,
        },
        components: componentsRef.value,
        hasConfirmButton,
      },
      on: {
        close: handleClose,
        confirm: handleConfirm,
      },
    });
  };

  return {
    renderFormDrawerDom,
    setDrawerOptions,
    setDrawerFormConfig,
    openDrawer,
    setDrawerExtraLogicParams,
  };
};

export default useFormDrawer;

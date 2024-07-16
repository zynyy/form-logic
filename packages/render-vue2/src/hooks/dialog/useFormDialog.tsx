import {
  clone,
  IFormProps,
  SchemaPatternEnum,
  useSchemaComponentsContext,
} from '@formlogic/render-core-vue2';
import { merge } from 'lodash-es';
import { h, ref, watch, watchEffect } from 'vue';

import { useJsonMetaSchema } from '@/hooks/useJsonMetaSchema';
import { useOpen } from '@/hooks/useOpen';
import { useSchemeFormContent } from '@/renderer-layout/scheme-form/hooks';
import { TransformsSchemaOptions } from '@/transforms';

import { DialogEvent, FormDialogProps } from './interface';

const useFormDialog = (props: FormDialogProps, event: DialogEvent) => {
  const [visible, openDialog, closeDialog] = useOpen();

  const ModalPageForm = 'ModalPageForm';

  const pageCode = ref<string>('');

  const { metaSchema } = useJsonMetaSchema(pageCode);

  const formDrawerConfig = ref<IFormProps>({});

  const componentsRef = useSchemaComponentsContext();

  const formContentRef = useSchemeFormContent();

  const isRenderDialog = ref(false);

  const extraLogicParams = ref({});

  const setDialogExtraLogicParams = (nextExtraLogicParams: Record<string, any>) => {
    extraLogicParams.value = nextExtraLogicParams;
  };

  const getDialogOptions = (transformsSchemaOptions?: Partial<TransformsSchemaOptions>) => {
    return merge(
      clone({
        metaSchema: metaSchema.value,
        hasGroup: true,
        pattern: SchemaPatternEnum.EDITABLE,
      }),
      transformsSchemaOptions,
    );
  };

  const options = ref<TransformsSchemaOptions>(getDialogOptions());

  const setDialogOptions = (transformsSchemaOptions?: Partial<TransformsSchemaOptions>) => {
    options.value = getDialogOptions(transformsSchemaOptions);
  };

  const setDialogFormConfig = (formConfig?: Partial<IFormProps>) => {
    const { dialogFormConfig } = props;
    formDrawerConfig.value = {
      ...dialogFormConfig,
      ...formConfig,
    };
  };

  const handleClose = () => {
    closeDialog();
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
        pageCode: props.dialogPageCode,
      };
    },
    () => {
      if (visible.value) {
        pageCode.value = props.dialogPageCode;
      }
    },
  );

  watch(metaSchema, () => {
    options.value = merge({}, options.value, {
      metaSchema: metaSchema.value,
    });
  });

  watchEffect(() => {
    if (visible.value && !isRenderDialog.value) {
      isRenderDialog.value = true;
    }
  });

  const renderFormDialogDom = () => {
    const {
      dialogValidateFormValues,
      dialogExtraLogicParams,
      dialogDetailApiConfig,
      dialogTitle,
      hasConfirmButton,
    } = props;

    const { getLogicConfig } = formContentRef.value;

    return h(ModalPageForm, {
      attrs: {
        visible: visible.value && isRenderDialog.value,
        options: options.value,
        title: dialogTitle,
        width: '50%',
        formConfig: formDrawerConfig.value,
        getLogicConfig,
        validateFormValues: dialogValidateFormValues,
        extraLogicParams: {
          ...dialogExtraLogicParams,
          ...extraLogicParams.value,
          closeDialog: handleClose,
          reRequest: event?.reRequest,
        },
        components: componentsRef.value,
        detailApiConfig: dialogDetailApiConfig,
        hasConfirmButton,
      },
      on: {
        close: handleClose,
        confirm: handleConfirm,
      },
    });
  };

  return {
    renderFormDialogDom,
    setDialogOptions,
    setDialogFormConfig,
    openDialog,
    setDialogExtraLogicParams,
  };
};

export default useFormDialog;

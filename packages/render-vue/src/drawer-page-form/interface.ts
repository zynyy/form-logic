import { ExtractPropTypes, PropType } from 'vue';
import { Components, EventsObject, LogicConfig } from '@/interface';
import { Form, IFormProps } from '@formily/core';

import { TransformsSchemaOptions } from '@/transforms';

export const getDrawerPageFormProps = () => {
  return {
    extraLogicParams: {
      type: Object as PropType<Record<string, any>>,
    },
    getLogicConfig: {
      type: Function as PropType<LogicConfig>,
      required: true as const,
    },
    options: {
      type: [null, Object] as PropType<TransformsSchemaOptions>,
      required: true as const,
    },
    components: {
      type: Object as PropType<Components>,
    },
    events: {
      type: Object as PropType<EventsObject>,
    },
    onFormMount: {
      type: Function as PropType<(form: Form) => void>,
    },
    formConfig: {
      type: Object as PropType<IFormProps>,
    },
    validateFormValues: {
      type: Function as PropType<(formValues: any) => Promise<string>>,
    },
    onConfirm: {
      type: Function as PropType<(formValues: any) => void>,
    },
    onClose: {
      type: Function as PropType<(e?: MouseEvent) => void>,
    },
    hasConfirmButton: {
      type: Boolean,
      default: true as const,
    },
    visible: {
      type: Boolean,
    },
    title: String,
    language: String,
    width: {
      type: [Number, String],
    },
  };
};

export type DrawerPageFormProps = ExtractPropTypes<ReturnType<typeof getDrawerPageFormProps>>;

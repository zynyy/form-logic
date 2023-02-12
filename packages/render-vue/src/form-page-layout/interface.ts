import { ExtractPropTypes, PropType } from 'vue';
import {Components, EventsObject, LogicConfig, MetaSchema, SchemaPattern} from '@/interface';
import { Form, IFormProps } from '@formily/core';

export const getFormPageLayoutProps = () => {
  return {
    language: String,
    pageCode: String,
    hasFooter:  {
      type: Boolean,
      default: true as const
    },
    hasBackBtn:  {
      type: Boolean,
      default: true as const
    },
    hasButton:  {
      type: Boolean,
      default: true as const
    },
    loading: {
      type: Boolean,
    },
    pattern: {
      type: String as PropType<SchemaPattern>,
      default: 'EDITABLE',
    },
    metaSchema: {
      type: Object as PropType<MetaSchema>,
    },
    hasGroup: {
      type: Boolean,
    },
    events: {
      type: Object as PropType<EventsObject>,
    },
    onFormMount: {
      type: Function as PropType<(form: Form) => void>,
    },
    onBackClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
    },
    formConfig: {
      type: Object as PropType<IFormProps>,
    },
    extraLogicParams: {
      type: Object as PropType<Record<string, any>>,
    },
    getLogicConfig:  {
      type: Function as PropType<LogicConfig>,
      required: true as const
    },
    components: {
      type: Object as PropType<Components>
    }
  };
};

export type FormPageLayoutProps = ExtractPropTypes<ReturnType<typeof getFormPageLayoutProps>>;

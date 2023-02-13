import { ExtractPropTypes, PropType } from 'vue';
import { Components, EventsObject, LogicConfig, MetaSchema, SchemaPattern } from '@/interface';
import { Form, IFormProps } from '@formily/core';
import { getArrayBaseEvent } from "@/components/array-base";

export const getListLayoutProps = () => {
  return {
    ...getArrayBaseEvent(),
    language: String,
    action: {
      type: String,
      required: true as const,
    },
    pageCode: String,
    cacheKey: String,
    reloadFlag: Number,
    loading: {
      type: Boolean,
    },
    hasCacheWhere: {
      type: Boolean,
    },

    metaSchema: {
      type: Object as PropType<MetaSchema>,
    },

    events: {
      type: Object as PropType<EventsObject>,
    },
    onSearchMount: {
      type: Function as PropType<(form: Form) => void>,
    },  onTableMount: {
      type: Function as PropType<(form: Form) => void>,
    },

    formConfig: {
      type: Object as PropType<IFormProps>,
    },

    extraLogicParams: {
      type: Object as PropType<Record<string, any>>,
    },
    getLogicConfig: {
      type: Function as PropType<LogicConfig>,
      required: true as const,
    },
    extraSearchParams: null,
    transformSearchParams: {
      type: Function as PropType<(searchParams: Record<string, any>) => Record<string, any>>,
    },

    components: {
      type: Object as PropType<Components>,
    },
  };
};

export type ListLayoutProps = ExtractPropTypes<ReturnType<typeof getListLayoutProps>>;

import type { Form } from '@formily/core';
import type { ExtractPropTypes, PropType } from 'vue';

import { AnyObject, Components, EventsObject, LogicConfig, SchemaPattern } from '@/interface';
import { ISchema } from '@formily/json-schema';
import { makeRequiredProp } from '@/utils/props';

export const getSchemeFormProps = () => {
  return {
    form: makeRequiredProp<PropType<Form>>(Object),
    schema: makeRequiredProp<PropType<ISchema>>(Object),
    getLogicConfig: {
      type: Function as PropType<LogicConfig>,
    },
    pattern: {
      type: String as PropType<SchemaPattern>,
      default: 'EDITABLE',
    },
    extraLogicParams: {
      type: Object as PropType<AnyObject>,
      default: {},
    },
    events: {
      type: Object as PropType<EventsObject>,
      default: {},
    },
    language: {
      type: String as PropType<string>,
      default: 'zh-CN',
    },
    loading: {
      type: Boolean,
      default: false,
    },

    components: {
      type: Object as PropType<Components>,
    },
  };
};

export type SchemeFormProps = ExtractPropTypes<ReturnType<typeof getSchemeFormProps>>;

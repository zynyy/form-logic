import { Components, MetaSchemaData } from '@/interface';
import { ExtractPropTypes, PropType } from 'vue';

export interface ClickRecord extends Pick<MetaSchemaData, 'code' | 'name' | 'eventCode'> {
  clickCodes: string[];
}

export const getButtonsProps = () => {
  return {
    loading: {
      type: Boolean,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: undefined,
    },
    buttons: {
      type: Array as PropType<MetaSchemaData[]>,
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent, record: ClickRecord) => void>,
    },
    components: {
      type: Object as PropType<Components>,
    },
  };
};

export type ButtonsProps = ExtractPropTypes<ReturnType<typeof getButtonsProps>>;

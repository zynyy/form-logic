import { ExtractPropTypes, PropType } from 'vue';
import { MetaSchemaData } from '@/interface';
import { ButtonsProps } from '@/components/buttons';

export const getWhereLayoutProps = () => {
  return {
    buttons: {
      type: Array as PropType<MetaSchemaData[]>,
    },
    collapsed: {
      type: Boolean,
    },
    hasCollapsed: {
      type: Boolean,
    },
    hasRestButton: {
      type: Boolean,
      default: true as const
    },
    hasSearchButton: {
      type: Boolean,
      default: true as const
    },

    onCollapsedClick: {
      type: Function as PropType<(collapsed: Boolean) => void>,
    },
    onRestClick: {
      type: Function as PropType<() => void>,
    },
    onSearchClick: {
      type: Function as PropType<() => void>,
    },

    onButtonItemClick: {
      type: Function as PropType<ButtonsProps['onClick']>,
    },
    title: String
  };
};

export type WhereLayoutProps = ExtractPropTypes<ReturnType<typeof getWhereLayoutProps>>;

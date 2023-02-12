import type { ExtractPropTypes, PropType, CSSProperties } from 'vue';

import { formLayoutValueContext } from '@/components/form-layout/hooks';

export const formLayoutProps = {
  ...formLayoutValueContext,
  class: {
    type: String,
  },
  style: {
    type: Object as PropType<CSSProperties>,
  },
};

export type FormLayoutProps = ExtractPropTypes<typeof formLayoutProps>;

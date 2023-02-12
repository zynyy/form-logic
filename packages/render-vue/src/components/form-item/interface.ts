import { ExtractPropTypes, PropType, CSSProperties } from 'vue';

import { IFormFeedback } from '@formily/core';
import {formLayoutValueContext} from "@/components/form-layout/hooks";

export const formItemProps = {
  ...formLayoutValueContext,
  label: {
    type: String,
  },
  tooltip: {
    type: String,
  },
  hiddenLabel: {
    type: Boolean,
  },
  asterisk: {
    type: Boolean,
  },
  style: {
    type: Object as PropType<CSSProperties>,
  },
  gridSpan: {
    type: Number,
  },
  feedbackText: {
    type: Array as PropType<IFormFeedback[]>,
  },
  feedbackStatus: {
    type: String,
  },
};

export type FormItemProps = ExtractPropTypes<typeof formItemProps>;

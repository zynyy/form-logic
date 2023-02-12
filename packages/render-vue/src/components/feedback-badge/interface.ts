import { ExtractPropTypes } from 'vue';

export const getFeedbackBadgeProps = () => {
  return {
    name: String,
  };
};

export type FeedbackBadgeProps = ExtractPropTypes<ReturnType<typeof getFeedbackBadgeProps>>;

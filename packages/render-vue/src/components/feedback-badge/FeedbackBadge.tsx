import { defineComponent } from 'vue';
import { useField } from '@/formily-vue';
import { Badge } from 'ant-design-vue';
import { FeedbackBadgeProps, getFeedbackBadgeProps } from '@/components/feedback-badge/interface';

const FeedbackBadge = defineComponent({
  name: 'FeedbackBadge',
  props: getFeedbackBadgeProps(),
  setup(props: FeedbackBadgeProps, { slots }) {
    const field = useField();

    return () => {
      const { name } = props;

      const errors = field.value.form.queryFeedbacks({
        type: 'error',
        address: `${name ? field.value.address.concat(name) : field.value.address}.*`,
      });

      if (errors.length) {
        return (
          <Badge size="small" class="errors-badge" count={errors.length}>
            {slots.default()}
          </Badge>
        );
      }

      return slots.default();
    };
  },
});

export default FeedbackBadge;

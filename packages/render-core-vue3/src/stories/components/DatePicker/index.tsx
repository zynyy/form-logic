import { ElDatePicker } from 'element-plus';
import { defineComponent } from 'vue';

const DatePicker = defineComponent({
  name: "DatePicker",
  setup(_, { attrs }) {
    return () => {
      return (
        <ElDatePicker {...attrs} />
      );
    };
  },
});

export default DatePicker;

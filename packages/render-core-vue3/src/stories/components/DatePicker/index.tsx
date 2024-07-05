import { ElDatePicker } from 'element-plus';
import { defineComponent } from 'vue';

const DatePicker = defineComponent({
  setup(_, { attrs }) {
    return () => {
      return (
        <div>
          <ElDatePicker {...attrs} />
        </div>
      );
    };
  },
});

export default DatePicker;

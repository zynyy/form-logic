import { observer } from '@/utils/observer';
import { defineComponent } from 'vue';
import { selectProps } from 'ant-design-vue/es/select';
import { Select as AntdSelect } from 'ant-design-vue';

const Select = observer(
  defineComponent({
    name: 'Select',
    inheritAttrs: false,
    props: selectProps(),
    setup(props, { attrs }) {
      return () => {
        const { readOnly } = attrs;
        return readOnly ? <span>{props.value}</span> : <AntdSelect {...props} />;
      };
    },
  }),
);

export default Select

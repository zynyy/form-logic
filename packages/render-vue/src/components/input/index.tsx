import { defineComponent } from 'vue';
import inputProps from 'ant-design-vue/es/input/inputProps';
import { Input as AntdInput } from 'ant-design-vue';
import { observer } from '@/formily-vue';

const Input = observer(
  defineComponent({
    name: 'Input',
    inheritAttrs: false,
    props: inputProps(),
    setup(props, { attrs }) {
      return () => {
        const { readOnly } = attrs;
        return readOnly ? <span>{props.value}</span> : <AntdInput {...props} />;
      };
    },
  }),
);

export default Input;

import { defineComponent } from 'vue';
import { useField } from '@/formily-vue';
import { ArrayAddProps, getArrayAddProps } from '../interface';

import { useArrayBasePrefix, useArrayContext } from '../hooks';

import { loop } from '@/utils';
import CustomButton from '@/components/custom-button';
import cls from 'classnames';
import { PlusOutlined } from '@ant-design/icons-vue';
import { VoidField } from '@formily/core';

const ArrayBaseAddition = defineComponent({
  name: 'ArrayBaseAddition',
  props: getArrayAddProps(),
  setup(props: ArrayAddProps) {
    const fieldRef = useField<VoidField>();
    const array = useArrayContext();

    const prefixCls = useArrayBasePrefix('add');

    const { onClick } = props;

    const handleClick = (e) => {
      e.stopPropagation();

      const field = fieldRef.value;

      const modelsFiled = {
        field,
        form: field.form,
        arrayField: array.field,
      };

      if (field.disabled) {
        return;
      }

      if (onClick) {
        onClick(modelsFiled);
        return;
      }

      if (array?.props?.onAdd) {
        array.props.onAdd(modelsFiled);
        return;
      }

      array.field?.push?.({}).then(loop);
    };

    return () => {
      const field = fieldRef.value;

      if (!array || !['editable', 'disabled'].includes(array.field?.pattern)) {
        return null;
      }

      return (
        <CustomButton
          type="primary"
          onClick={handleClick}
          class={cls(prefixCls, {
            [`${prefixCls}-disabled`]: field.disabled,
          })}
          title={field.title}
          disabled={field.disabled}
          v-slots={{
            icon: () => {
              return <PlusOutlined />;
            },
          }}
        />
      );
    };
  },
});

export default ArrayBaseAddition;

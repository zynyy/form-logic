import { defineComponent } from 'vue';
import { ArrayMoveDownProps, getArrayMoveDownProps } from '../interface';
import { useField } from '@/formily-vue';
import { VoidField } from '@formily/core';
import { loop } from '@/utils';
import CustomButton from '@/components/custom-button';
import cls from 'classnames';
import { DownOutlined } from '@ant-design/icons-vue';

import { useArrayBasePrefix, useArrayContext, useArrayItemContext } from '../hooks';

const MoveDownButton = defineComponent({
  name: 'ArrayBaseMoveDown',
  props: getArrayMoveDownProps(),
  setup(props: ArrayMoveDownProps) {
    const arrayItemContextRef = useArrayItemContext();
    const array = useArrayContext();
    const prefixCls = useArrayBasePrefix('move-down');

    const { onClick } = props;

    const fieldRef = useField<VoidField>();

    const handleClick = (e) => {
      e.stopPropagation();

      const { index, record } = arrayItemContextRef.value;

      const field = fieldRef.value;

      if (field.disabled) {
        return;
      }

      const modelsFiled = {
        field,
        form: field.form,
        arrayField: array.field,
      };

      if (onClick) {
        onClick(index, record, modelsFiled);
        return;
      }

      if (array.props?.onMoveDown) {
        array.props.onMoveDown(index, record, modelsFiled);
        return;
      }

      array.field?.moveDown(index).then(loop);
    };

    return () => {
      if (!array || !['editable'].includes(array.field?.pattern)) {
        return null;
      }

      const field = fieldRef.value;

      return (
        <CustomButton
          class={cls(prefixCls, {
            [`${prefixCls}-disabled`]: field.disabled,
          })}
          onClick={handleClick}
          disabled={field.disabled}
          title={field.title}
          v-slots={{
            icon: () => <DownOutlined />,
          }}
        />
      );
    };
  },
});

export default MoveDownButton;

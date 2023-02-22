import {defineComponent, unref} from 'vue';
import { ArrayMoveUpProps, getArrayMoveUpProps } from '../interface';
import { useField } from '@/formily-vue';
import { VoidField } from '@formily/core';
import { loop } from '@/utils';
import CustomButton from '@/components/custom-button';
import cls from 'classnames';
import { UpOutlined } from '@ant-design/icons-vue';

import { useArrayBasePrefix, useArrayContext, useArrayItemContext } from '../hooks';

const MoveUp = defineComponent({
  name: 'ArrayBaseMoveUp',
  props: getArrayMoveUpProps(),
  setup(props: ArrayMoveUpProps) {
    const arrayItemContextRef = useArrayItemContext();
    const array = useArrayContext();

    const prefixCls = useArrayBasePrefix('move-up');

    const { onClick } = props;

    const fieldRef = useField<VoidField>();

    const handleClick = (e) => {
      e.stopPropagation();

      const { index, record:recordRef } = arrayItemContextRef.value;

      const field = fieldRef.value;
      const record = unref(recordRef)

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

      if (array.props?.onMoveUp) {
        array.props.onMoveUp(index, record, modelsFiled);
        return;
      }

      array.field.moveUp(index).then(loop);
    };

    return () => {
      const field = fieldRef.value;

      if (!array || !['editable'].includes(array.field?.pattern)) {
        return null;
      }

      return (
        <CustomButton
          class={cls(prefixCls, {
            [`${prefixCls}-disabled`]: field.disabled,
          })}
          onClick={handleClick}
          disabled={field.disabled}
          title={field.title}
          v-slots={{
            icon: () => <UpOutlined />,
          }}
        />
      );
    };
  },
});

export default MoveUp;

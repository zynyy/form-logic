import {defineComponent, unref} from 'vue';
import { ArrayRemoveProps, getArrayRemoveProps } from '../interface';
import { useField } from '@/formily-vue';
import { loop } from '@/utils';
import CustomButton from '@/components/custom-button';
import { CustomButtonMode } from '@/interface';
import cls from 'classnames';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { VoidField } from '@formily/core';

import { useArrayBasePrefix, useArrayContext, useArrayIndex, useArrayItemRecord } from '../hooks';

const ArrayBaseRemove = defineComponent({
  name: 'ArrayBaseRemove',
  props: getArrayRemoveProps(),
  inheritAttrs: false,
  setup(props: ArrayRemoveProps) {
    const { onClick } = props;

    const indexRef = useArrayIndex();
    const recordRef = useArrayItemRecord();
    const fieldRef = useField<VoidField>();
    const array = useArrayContext();

    const prefixCls = useArrayBasePrefix('remove');
    const handleClick = (e) => {
      e.stopPropagation();

      const index = indexRef.value;

      const field = fieldRef.value;

      if (field.disabled) {
        return;
      }

      const record = unref(recordRef)

      const modelsFiled = {
        field,
        form: field.form,
        arrayField: array.field,
      };

      if (onClick) {
        onClick(index, record, modelsFiled);
        return;
      }

      if (array?.props?.onRemove) {
        array.props.onRemove(index, record, modelsFiled);
        return;
      }

      array.field?.remove(index).then(loop);
    };

    return () => {
      if (!array || !['editable'].includes(array.field?.pattern)) {
        return null;
      }

      const field = fieldRef.value;

      return (
        <CustomButton
          hasPopConfirm
          mode={CustomButtonMode.icon}
          onClick={handleClick}
          class={cls(prefixCls, {
            [`${prefixCls}-disabled`]: field.disabled,
          })}
          title={field.title}
          disabled={field.disabled}
          v-slots={{
            icon: () => {
              return <DeleteOutlined />;
            },
          }}
        />
      );
    };
  },
});

export default ArrayBaseRemove;

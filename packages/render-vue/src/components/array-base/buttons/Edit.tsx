import {defineComponent, unref} from 'vue';
import { ArrayEditProps, getArrayEditProps } from '../interface';
import { useField } from '@/formily-vue';

import CustomButton from '@/components/custom-button';
import { CustomButtonMode } from '@/interface';
import cls from 'classnames';
import { EditOutlined } from '@ant-design/icons-vue';
import { VoidField } from '@formily/core';

import { useArrayBasePrefix, useArrayContext, useArrayIndex, useArrayItemRecord } from '../hooks';

const ArrayBaseEdit = defineComponent({
  name: 'ArrayBaseEdit',
  inheritAttrs: false,
  props: getArrayEditProps(),
  setup(props: ArrayEditProps) {
    const indexRef = useArrayIndex();
    const recordRef = useArrayItemRecord();
    const fieldRef = useField<VoidField>();
    const array = useArrayContext();

    const { onClick } = props;

    const prefixCls = useArrayBasePrefix('edit');

    const handleClick = (e) => {
      e.stopPropagation();
      const record = unref(recordRef)

      const index = indexRef.value;

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
        onClick(index, record, modelsFiled);
        return;
      }

      if (array.props?.onEdit) {
        array.props.onEdit?.(index, record, modelsFiled);
      }
    };

    return () => {
      const field = fieldRef.value;
      if (!array || !['editable'].includes(array.field?.pattern)) {
        return null;
      }

      return (
        <CustomButton
          hasTooltip
          mode={CustomButtonMode.icon}
          onClick={handleClick}
          class={cls(prefixCls, {
            [`${prefixCls}-disabled`]: field.disabled,
          })}
          title={field.title}
          disabled={field.disabled}
          v-slots={{
            icon: () => {
              return <EditOutlined />;
            },
          }}
        />
      );
    };
  },
});

export default ArrayBaseEdit;

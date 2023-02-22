import {defineComponent, unref} from 'vue';
import { ArrayCopyProps, getArrayCopyProps } from '../interface';
import { useField } from '@/formily-vue';
import { clone } from '@formily/shared';
import { loop } from '@/utils';
import CustomButton from '@/components/custom-button';
import { CustomButtonMode } from '@/interface';
import cls from 'classnames';
import { CopyOutlined } from '@ant-design/icons-vue';
import { VoidField } from '@formily/core';

import { useArrayBasePrefix, useArrayContext, useArrayIndex, useArrayItemRecord } from '../hooks';

const ArrayBaseCopy = defineComponent({
  name: 'ArrayBaseCopy',
  inheritAttrs: false,
  props: getArrayCopyProps(),
  setup(props: ArrayCopyProps) {
    const indexRef = useArrayIndex();
    const recordRef = useArrayItemRecord();
    const fieldRef = useField<VoidField>();
    const array = useArrayContext();

    const { onClick } = props;

    const prefixCls = useArrayBasePrefix('copy');

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

      if (array.props?.onCopy) {
        array.props.onCopy?.(index, record, modelsFiled);
        return;
      }

      const value = clone(array?.field?.value[index] ?? {});
      const distIndex = index + 1;
      array.field?.insert?.(distIndex, value).then(loop);
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
              return <CopyOutlined />;
            },
          }}
        />
      );
    };
  },
});

export default ArrayBaseCopy;

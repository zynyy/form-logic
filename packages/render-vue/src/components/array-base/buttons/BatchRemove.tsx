import { defineComponent } from 'vue';
import { getArrayBatchRemoveProps, ArrayBatchRemoveProps } from '../interface';
import { useField } from '@/formily-vue';

import CustomButton from '@/components/custom-button';
import { CustomButtonMode } from '@/interface';
import cls from 'classnames';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { VoidField } from '@formily/core';
import { loop } from '@/utils';
import { useArrayContext, useArrayBasePrefix } from '../hooks';

const ArrayBaseRemove = defineComponent({
  name: 'ArrayBaseRemove',
  props: getArrayBatchRemoveProps(),
  inheritAttrs: false,
  setup(props: ArrayBatchRemoveProps) {
    const { onClick } = props;

    const fieldRef = useField<VoidField>();
    const array = useArrayContext();

    const prefixCls = useArrayBasePrefix('batch-remove');
    const handleClick = (e) => {
      e.stopPropagation();

      const field = fieldRef.value;

      const { selectedRows, selectedRowKeys, onBatchRemove, setSelectedRows, setSelectedRowKeys } =
        array.props || {};

      const disabled = field.disabled || !array.props.selectedRowKeys?.length;

      if (disabled) {
        return;
      }

      const modelsFiled = {
        field,
        form: field.form,
        arrayField: array.field,
      };

      const rowSelected = {
        selectedRows,
        selectedRowKeys,
        setSelectedRows,
        setSelectedRowKeys,
      };

      if (onClick) {
        return onClick(rowSelected, modelsFiled);
      }

      if (onBatchRemove) {
        return onBatchRemove(rowSelected, modelsFiled);
      }

      const data = array.field.value;

      const index = selectedRows.map((item) => {
        return data.indexOf(item);
      });

      array.field
        .onInput(
          data.filter((item, idx) => {
            return !index.includes(idx);
          }),
        )
        .then(loop);

      setSelectedRows([]);
      setSelectedRowKeys([]);
    };

    return () => {
      if (!array || !['editable'].includes(array.field?.pattern)) {
        return null;
      }

      const field = fieldRef.value;

      const disabled = field.disabled || !array.props.selectedRowKeys?.length;

      return (
        <CustomButton
          hasPopConfirm
          mode={CustomButtonMode.text}
          onClick={handleClick}
          class={cls(prefixCls, {
            [`${prefixCls}-disabled`]: disabled,
          })}
          title={field.title}
          disabled={disabled}
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

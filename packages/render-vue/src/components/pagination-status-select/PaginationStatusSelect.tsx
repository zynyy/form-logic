
import { defineComponent } from 'vue';
import cls from 'classnames';
import { Badge, Select } from 'ant-design-vue';
import { ArrayField } from '@formily/core';
import { useField, useForm } from '@/formily-vue';
import { FormPath } from '@formily/shared';
import { STYLE_PREFIX } from '@/utils/constant';
import { getPaginationStatusSelectProps, PaginationStatusSelectProps } from './interface';

const prefixCls = `${STYLE_PREFIX}`;

const PaginationStatusSelect = defineComponent({
  props: getPaginationStatusSelectProps(),
  setup(props: PaginationStatusSelectProps) {
    const form = useForm();
    const field = useField<ArrayField>();

    const createIndexPattern = (page: number | string) => {
      const pattern = `${field.value.address}.*[${(Number(page) - 1) * props.pageSize}:${
        Number(page) * props.pageSize
      }].*`;
      return FormPath.parse(pattern);
    };

    return () => {
      const { onChange, value } = props;

      const errors = form.value.queryFeedbacks({
        type: 'error',
        address: `${field.value.address}.*`,
      });

      const dataSource = props.options?.map(({ label, value }) => {
        const hasError = errors.some(({ address }) => {
          return createIndexPattern(value).match(address);
        });
        return {
          label: hasError ? <Badge dot>{label}</Badge> : label,
          value,
        };
      });

      const width = String(dataSource?.length).length * 15;

      return (
        <Select
          value={value}
          onChange={onChange}
          options={dataSource}
          virtual
          style={{
            width: width < 60 ? 60 : width,
          }}
          class={cls(`${prefixCls}-status-select`, {
            'has-error': errors?.length,
          })}
        />
      );
    };
  },
});

export default PaginationStatusSelect;

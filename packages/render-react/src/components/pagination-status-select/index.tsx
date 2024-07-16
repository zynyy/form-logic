import { FC } from 'react';
import { observer, useField, useForm } from '@formily/react';
import { ArrayField } from '@formily/core';

import { FormPath } from '@formily/shared';
import { Badge, Select, SelectProps } from 'antd';
import cls from 'classnames';
import { useArrayPaginationStyle } from '@/components/array-pagination/hooks';

interface PaginationStatusSelectProps extends SelectProps<any> {
  pageSize?: number;
}

const PaginationStatusSelect: FC<PaginationStatusSelectProps> = observer(
  ({ pageSize, value, onChange, options }) => {
    const form = useForm();
    const field = useField<ArrayField>();
    const [warpSSR, hashId, prefixCls] = useArrayPaginationStyle();

    const errors = form.queryFeedbacks({
      type: 'error',
      address: `${field.address}.*`,
    });

    const createIndexPattern = (page: number | string) => {
      const pattern = `${field.address}.*[${(Number(page) - 1) * pageSize}:${
        Number(page) * pageSize
      }].*`;
      return FormPath.parse(pattern);
    };

    const dataSource = options?.map(({ label, value }) => {
      const hasError = errors.some(({ address }) => {
        return createIndexPattern(value).match(address);
      });
      return {
        label: hasError ? <Badge dot>{label}</Badge> : label,
        value,
      };
    });

    const width = String(dataSource?.length).length * 15;

    return warpSSR(
      <Select
        value={value}
        onChange={onChange}
        options={dataSource}
        virtual
        style={{
          width: width < 60 ? 60 : width,
        }}
        className={cls(`${prefixCls}-status-select`, hashId, {
          'has-error': errors?.length,
        })}
      />,
    );
  },
  {
    scheduler(request) {
      requestAnimationFrame(request);
    },
  },
);

export default PaginationStatusSelect;

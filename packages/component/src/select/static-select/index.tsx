import { FC, useEffect, useState } from 'react';
import { Select, SelectProps } from 'antd';

import { transformToOptions } from '@/utils';
import { useLabelOptions } from '@/hooks';

export interface StaticSelectProps<V = any> extends Omit<SelectProps<any>, 'onChange'> {
  valueTemplateKey?: string;
  labelTemplateKey?: string;
  filterData?: string[];
  readOnly?: boolean;
  data?: any[];
  onChange?: (value: V, record?: any) => void;
}

const StaticSelect: FC<StaticSelectProps> = ({
  valueTemplateKey,
  labelTemplateKey,
  onChange,
  value,
  data,
  readOnly,
  filterData,
  ...restProps
}) => {
  const [options, setOptions] = useState<any[]>([]);

  const [dataSource, setDataSource] = useState<any[]>([]);

  const findRecord = (val: string): undefined | any => {
    return val ? dataSource.find((item) => item.value === val) : undefined;
  };

  const triggerChange = (changedValue: any) => {
    const record = Array.isArray(changedValue)
      ? changedValue
          .map((val) => {
            return findRecord(val);
          })
          .filter((val) => val)
      : findRecord(changedValue);

    onChange?.(changedValue, record);
  };

  const transformData = (data: any): any[] => {
    return transformToOptions(data, labelTemplateKey, valueTemplateKey);
  };

  const handleSearch = (likeValue: string) => {
    const caseLikeValue = likeValue?.toLocaleUpperCase() || '';

    setOptions(
      likeValue
        ? dataSource.filter((item) => {
            const { value, label } = item;
            return (
              value.toLocaleUpperCase().includes(caseLikeValue) ||
              label.toLocaleUpperCase().includes(caseLikeValue)
            );
          })
        : dataSource,
    );
  };

  const handleBlur = () => {
    setOptions(dataSource);
  };

  const handleChange = (value: any) => {
    triggerChange(value);
  };

  useEffect(() => {
    if (data) {
      const newData = transformData(data);
      setDataSource(newData);
      setOptions(newData);
    }
  }, [data]);

  const detailValue = useLabelOptions(dataSource, value);

  return readOnly ? (
    <span>{detailValue}</span>
  ) : (
    <Select
      allowClear
      showSearch
      {...restProps}
      value={value}
      style={{ width: '100%' }}
      onSearch={handleSearch}
      filterOption={false}
      onBlur={handleBlur}
      options={
        filterData?.length
          ? options.filter((item) => {
              return !(filterData || []).includes(item.value);
            })
          : options
      }
      onChange={handleChange}
    />
  );
};

export default StaticSelect;

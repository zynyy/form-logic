import { FC, useEffect, useMemo, useState } from 'react';
import { Select, SelectProps } from 'antd';

import { strNumBoolToBoolean, transformToOptions } from '@/utils';
import { useDeepEffect, useLabelOptions } from '@/hooks';
import { StrNumBool } from '@/interface';

export interface StaticSelectProps<V = any> extends Omit<SelectProps<any>, 'onChange'> {
  valueTemplateKey?: string;
  labelTemplateKey?: string;
  filterData?: string[];
  readOnly?: boolean;
  data?: any[];
  onChange?: (value: V, record?: any) => void;
  defaultFirstOptionValue?: StrNumBool;
}

const StaticSelect: FC<StaticSelectProps> = ({
  valueTemplateKey,
  labelTemplateKey,
  onChange,
  value,
  data,
  readOnly,
  filterData,
  labelInValue,
  defaultFirstOptionValue,
  mode,
  ...restProps
}) => {
  const [options, setOptions] = useState<any[]>([]);

  const [dataSource, setDataSource] = useState<any[]>([]);

  const isMultiple = useMemo(() => {
    return ['multiple', 'tags'].includes(mode);
  }, [mode]);

  const findRecord = (val: any): undefined | any => {
    let value = val;

    if (labelInValue) {
      value = val.value;
    }

    return value ? dataSource.find((item) => item.value === value) : undefined;
  };

  const triggerChange = (changedValue: any) => {
    const record = Array.isArray(changedValue)
      ? changedValue
          .map((val) => {
            return findRecord(val);
          })
          .filter((val) => val)
      : findRecord(changedValue);

    onChange?.(labelInValue ? record : changedValue, record);
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

  useDeepEffect(() => {
    if (
      strNumBoolToBoolean(defaultFirstOptionValue) &&
      value !== 0 &&
      !value &&
      !value.length &&
      dataSource.length
    ) {
      const firstRecord = dataSource[0];

      const val = labelInValue ? firstRecord : firstRecord.value;

      triggerChange(isMultiple ? [val] : val);
    }
  }, [defaultFirstOptionValue, dataSource, value, labelInValue, isMultiple]);

  const detailValue = useLabelOptions(dataSource, value);

  return readOnly ? (
    <span>{detailValue}</span>
  ) : (
    <Select
      allowClear
      showSearch
      {...restProps}
      value={value}
      mode={mode}
      labelInValue={labelInValue}
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

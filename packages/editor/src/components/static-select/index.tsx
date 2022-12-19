import { FC, useEffect, useRef, useState } from "react";
import { Select, SelectProps } from "antd";

import mustache from "mustache";

export interface RemoteSelectProps<V = any>
  extends Omit<SelectProps<any>, "onChange"> {
  valueTemplateKey?: string;
  labelTemplateKey?: string;
  data?: any[];
  onChange?: (value: V, record?: any) => void;
}

const StaticSelect: FC<RemoteSelectProps> = ({
  valueTemplateKey,
  labelTemplateKey,
  showSearch,
  onChange,
  value,
  mode,
  placeholder,
  disabled,
  data,
  ...restProps
}) => {
  const [options, setOptions] = useState<any[]>([]);

  const [dataSource, setDataSource] = useState<any[]>([]);

  const selectRef = useRef<any>(undefined);

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
    return data.map((item: any) => {
      const label = mustache.render(labelTemplateKey || "{{name}}", item);
      const value = mustache.render(valueTemplateKey || "{{code}}", item);

      return {
        ...item,
        label,
        value,
      };
    });
  };

  const handleSearch = (likeValue: string) => {
    const caseLikeValue = likeValue?.toLocaleUpperCase() || "";

    setOptions(
      likeValue
        ? dataSource.filter((item) => {
            const { value, label } = item;
            return (
              value.toLocaleUpperCase().includes(caseLikeValue) ||
              label.toLocaleUpperCase().includes(caseLikeValue)
            );
          })
        : dataSource
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

  return (
    <Select
      allowClear
      dropdownStyle={{
        minWidth: 400,
      }}
      {...restProps}
      value={value}
      disabled={disabled}
      mode={mode}
      style={{ width: "100%" }}
      showSearch
      onSearch={handleSearch}
      filterOption={false}
      onBlur={handleBlur}
      options={options}
      onChange={handleChange}
      ref={selectRef}
      optionLabelProp="value"
    />
  );
};

export default StaticSelect;

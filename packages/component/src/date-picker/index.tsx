import { DatePicker as AntdDatePicker, DatePickerProps as AntdDatePickerProps } from 'antd';

import { FC } from 'react';
import { getDateDefaultFormat } from '@/utils';
import { formatDayjsValue, toDayjs } from '@/utils/dayjs';
import { Dayjs } from 'dayjs';

type GetDateProps<T> = T extends { showTime?: any } ? T : never;

interface DatePickerProps extends Omit<GetDateProps<AntdDatePickerProps>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string | string[]) => void;
}

const DatePicker: FC<DatePickerProps> = ({
  format: propsFormat,
  picker,
  value: propsValue,
  onChange,
  showTime,
  ...props
}) => {
  const format =
    propsFormat ||
    getDateDefaultFormat({
      picker,
      showTime,
    });

  const value = toDayjs(propsValue, format as string);

  const handleChange = (value: Dayjs) => {
    if (onChange) {
      onChange(formatDayjsValue(value, format));
    }
  };

  return (
    <AntdDatePicker
      {...props}
      showTime={showTime}
      format={format}
      value={value}
      onChange={handleChange}
    />
  );
};

export default DatePicker;

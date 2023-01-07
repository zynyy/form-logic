import dayjs from 'dayjs';
import { isArray, isEmpty, isFunction } from '@/utils/is';

export const toDayjs = (value: dayjs.ConfigType | dayjs.ConfigType[], format?: string): any => {
  if (!value) return value;
  if (Array.isArray(value)) {
    return value.map((val) => {
      const date = dayjs(val, format);
      return date.isValid() ? date : val;
    });
  } else {
    const date = dayjs(value, format);
    return date.isValid() ? date : value;
  }
};

export const formatDayjsValue = (value: any, format: any): string | string[] => {
  const validFormatDate = (date: any, format: any) => {
    if (typeof date === 'number') {
      return dayjs(date).format(format);
    }
    const _date = dayjs(date, format);
    return _date.isValid() ? _date.format(format) : date;
  };

  const formatDate = (date: any, format: any, i = 0) => {
    if (!date) return date;
    if (isArray(format)) {
      const _format = format[i];
      if (isFunction(_format)) {
        return _format(date);
      }
      if (isEmpty(_format)) {
        return date;
      }
      return validFormatDate(date, _format);
    } else {
      if (isFunction(format)) {
        return format(date);
      }
      if (isEmpty(format)) {
        return date;
      }
      return validFormatDate(date, format);
    }
  };

  if (isArray(value)) {
    return value.map((val, index) => {
      return formatDate(val, format, index);
    });
  } else {
    return formatDate(value, format);
  }
};

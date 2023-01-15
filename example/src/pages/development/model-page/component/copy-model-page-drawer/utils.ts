import { groupBy } from 'lodash-es';
import { message } from 'antd';
import { toArray } from '@formlogic/component';

export const checkRepeat = (data: any) => {
  const typeGroup = groupBy(data, 'type') || {};

  let type = '';

  let field: any[] = [];

  Object.keys(typeGroup).forEach((key) => {
    const columnType = groupBy(typeGroup[key], 'code');
    const fieldType = Object.keys(columnType).filter((key) => columnType[key].length > 1);
    if (fieldType.length) {
      type = key;
      field = fieldType;
    }
  });

  if (type) {
    message.warning(` 类型 ${type}: ${field.join(',')} 字段重复`).then(() => void 0);

    return true;
  }

  return false;
};

export const findRecord = (data: any[], field: string) => {
  return data.find((current: any) => {
    const { code, type } = current || {};

    return `${code}_${type}` === field;
  });
};

export const transformData = (data:any[]) => {

  return toArray(data).map((item: any) => {
    const { code, name, type } = item;
    return {
      name: name,
      code: `${code}_${type}`,
    };
  });
}

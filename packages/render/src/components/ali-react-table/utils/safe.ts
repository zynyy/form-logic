import { ArtColumn } from '../interfaces';

export const safeRenderHeader = (column: ArtColumn) => {
  return column.title ?? column.name;
};

export const safeGetValue = (column: ArtColumn, record: any, rowIndex: number) => {
  if (column.getValue) {
    return column.getValue(record, rowIndex);
  }
  return record[column.code];
};

export const safeGetRowKey = (
  primaryKey: string | ((record: any) => string),
  record: any,
  rowIndex: number,
): string => {
  let key;
  if (typeof primaryKey === 'string') {
    key = record[primaryKey];
  } else if (typeof primaryKey === 'function') {
    key = primaryKey(record);
  }
  if (key == null) {
    key = String(rowIndex);
  }
  return key;
};

export const safeGetCellProps = (column: ArtColumn, record: any, rowIndex: number) => {
  if (column.getCellProps) {
    const value = safeGetValue(column, record, rowIndex);
    return column.getCellProps(value, record, rowIndex) || {};
  }
  return {};
};

export const safeRender = (column: ArtColumn, record: any, rowIndex: number) => {
  const value = safeGetValue(column, record, rowIndex);
  if (column.render) {
    return column.render(value, record, rowIndex);
  }
  return value;
};

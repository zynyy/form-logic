import { ObservableColumnSource } from '@/hooks';
import { TableProps } from 'ant-design-vue/lib/table';

const useArrayTableColumns = (
  dataSource: any[],
  sources: ObservableColumnSource[],
): TableProps<any>['columns'] => {
  const parseChildren = (parentName) => {
    return sources.reduce((buf, { name, columnProps, schema, display }, index) => {
      if (display !== 'visible') {
        return buf;
      }

      if (parentName !== schema['x-data']?.parentCode) {
        return buf;
      }

      const children = parseChildren(name);

      if (children.length) {
        return buf.concat({
          ...columnProps,
          key: `${name}_${index}`,
          dataIndex: name,
          title: schema['title'],
          schema,
          ellipsis: true,
          children,
        });
      }

      return buf.concat({
        ...columnProps,
        key: `${name}_${index}`,
        dataIndex: name,
        title: schema['title'],
        width: columnProps['width'] ?? 120,
        ellipsis: true,
        schema
      });
    }, []);
  };

  const leftColumns = [];
  const columns = [];
  const rightColumns = [];

  sources
    .reduce((buf, { name, columnProps, schema, display }, index) => {
      if (display !== 'visible' || schema['x-data']?.parentCode) {
        return buf;
      }

      const children = parseChildren(name);

      if (children.length) {
        return buf.concat({
          ...columnProps,
          key: `${name}_${index}`,
          dataIndex: name,
          title: schema['title'],
          schema,
          children,
          ellipsis: true,
        });
      }

      return buf.concat({
        ...columnProps,
        key: `${name}_${index}`,
        dataIndex: name,
        title: schema['title'],
        width: columnProps['width'] ?? 120,
        schema,
        ellipsis: true,
      });
    }, [])
    .forEach((item) => {
      const { fixed } = item || {};

      if (!fixed) {
        columns.push(item);
      } else if (fixed === true || fixed === 'left') {
        leftColumns.push(item);
      } else {
        rightColumns.push(item);
      }
    });

  return leftColumns.concat(columns).concat(rightColumns);
};

export default useArrayTableColumns;

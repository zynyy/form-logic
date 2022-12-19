import { FC, Key, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Select, SelectProps, Space, Spin, Table, TableProps } from 'antd';

import TablePagination from '../table-pagination';

import { isFunction, isObject, isString, merge } from 'lodash-es';

import mustache from 'mustache';

import { toArray, arrayToNestJson } from '../../utils';
import { DataApiConfig, getData } from '../../service';

export interface SelectTableProps<V = any>
  extends Omit<SelectProps, 'onChange'>,
    Required<Pick<TableProps<any>, 'columns'>> {
  valueTemplateKey?: string;
  labelTemplateKey?: string;
  keywordKey?: string;
  onChange: (value: V, record: any) => void;
  rowKey?: string;
  editable?: boolean;
  api: DataApiConfig;
  tableCheckboxProps?: (record: any) => any;
  tableRowSelection?: () => TableProps<any>['rowSelection'];
  renderTableCell?: {
    [key: string]: (text: any, record: any, rowIndex: number) => ReactNode;
  };

  exactQueryParamKey?: string;
}

type ChangeValue = string | { value: string; [key: string]: any };

const SelectTable: FC<SelectTableProps> = ({
  valueTemplateKey,
  labelTemplateKey,
  disabled,
  columns,
  showSearch,
  keywordKey,
  onChange,
  value,
  rowKey,
  editable,
  api,
  mode,
  tableCheckboxProps,
  tableRowSelection,
  renderTableCell,
  placeholder,
  exactQueryParamKey,

  ...restProps
}) => {
  const { method, url } = api || {};

  const isMultiple = useMemo(() => {
    return mode ? ['multiple', 'tags'].includes(mode) : false;
  }, [mode]);

  const [loading, setLoading] = useState(false);

  const [isExactSearch, setIsExactSearch] = useState(false);

  const [selectValue, setSelectValue] = useState<any[]>([]);

  const [isSearch, setIsSearch] = useState(false);

  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const [dataSource, setDataSource] = useState<any[]>(() => {
    return [];
  });

  const [likeSearch, setLikeSearch] = useState<boolean>(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const [scrollX, setScrollX] = useState('100%');

  const selectRef = useRef<any>(undefined);
  const containerRef = useRef<any>(undefined);

  const { current, pageSize, total } = paginationConfig;

  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  const transformValue = (val: ChangeValue) => {
    return isObject(val) && typeof val !== 'string' ? val.value : val;
  };

  const triggerChange = (changedValue: any) => {
    const values =
      Array.isArray(changedValue) && isMultiple
        ? changedValue.map((item) => {
            return transformValue(item);
          })
        : transformValue(changedValue);

    onChange?.(values, changedValue);
  };

  const mergeParams = (path: any, value: any, params: any): any => {
    const keywordKeyPath = Array.isArray(path) ? path : path?.split('.') || [];

    return merge({}, params, arrayToNestJson(keywordKeyPath, value));
  };

  const generateParams = () => {
    const { params } = api || { params: {} };

    return {
      ...mergeParams(keywordKey, keyword, params),
      pageSize,
      pageNo: current,
    };
  };

  const transformData = (data: any[]): any[] => {
    return data.map((item: any) => {
      const label = mustache.render(labelTemplateKey || '{{name}}', item);
      const value = mustache.render(valueTemplateKey || '{{code}}', item);

      return {
        ...item,
        label,
        value,
      };
    });
  };

  // 精准查询
  const exactSearch = (codes: string[]) => {
    if (!url) return;

    let queryParamKey = exactQueryParamKey;

    if (!exactQueryParamKey) {
      queryParamKey = keywordKey;
    }

    if (!queryParamKey) {
      setIsExactSearch(true);
      return;
    }

    const { params } = api || { params: {} };

    const exactParams = mergeParams(queryParamKey, codes[0], params);

    getData({
      method,
      url,
      params: {
        pageSize: codes.length,
        pageNo: 1,
        ...exactParams,
      },
    }).then((res: any) => {
      const { content } = res;

      const data = transformData(content);

      const newSelectValue = selectValue.concat(
        data.filter((item) => {
          return !selectValue.find((current) => current.value === item.value);
        }),
      );

      setSelectValue(newSelectValue);

      if (!dataSource.length) {
        setDataSource(newSelectValue);
      }

      setIsExactSearch(true);

      setSelectedRowKeys(value);

      if (data.length) {
        handleChange(isMultiple ? data : data[0]);
      }
    });
  };

  /***
   * 模糊匹配
   */
  const search = () => {
    if (!editable) return;

    if (!url) return;

    const params = generateParams();

    setLoading(true);
    getData({
      method,
      url,
      params,
    })
      .then((res: any) => {
        setLoading(false);
        const { content, totalElements } = res;

        setDataSource(transformData(content));

        setIsSearch(false);

        setPaginationConfig((page) => {
          return {
            ...page,
            total: totalElements,
          };
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const handleSearchClick = () => {
    setLikeSearch(true);

    setPaginationConfig((page) => {
      return {
        ...page,
        current: 1,
      };
    });

    if (current === 1) {
      search();
    }
  };

  const handlePaginationChange = (nextCurrent: number, nextPageSize: number) => {
    setIsSearch(true);

    setPaginationConfig((page) => {
      return {
        ...page,
        current: nextCurrent,
        pageSize: nextPageSize,
      };
    });
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const tableColumnsWidth = columns?.reduce((accumulation, current) => {
      return accumulation + Number(current?.width || 120);
    }, 0);

    if (tableColumnsWidth > containerRef.current.clientWidth) {
      setScrollX(`${tableColumnsWidth}px`);
    }
  }, [columns, containerRef]);

  const handleFocus = () => {
    if (!dataSource.length || (!value && likeSearch)) {
      setIsSearch(true);
      setLikeSearch(false);
    }
  };

  useEffect(() => {
    if (!dropdownVisible) return;

    if (isSearch) {
      search();
    }
  }, [dropdownVisible, current, pageSize, isSearch]);

  useEffect(() => {
    setDataSource([]);
    setSelectedRowKeys([]);
  }, [JSON.stringify(api)]);

  const handleDropdownVisibleChange = (open: boolean) => {
    if (!open) {
      setSelectedRowKeys([]);
    }

    setDropdownVisible(open);
  };

  const handleRow = (record: any) => {
    return {
      onClick: () => {
        if (isMultiple) return;
        setSelectValue([record]);

        triggerChange(record);

        selectRef.current?.blur();
      },
    };
  };

  const handleChange = (value: any) => {
    if (isMultiple) {
      setSelectedRowKeys(value.map((item: any) => item.value));

      triggerChange(
        value
          .map((item: any) => {
            return selectValue.find((current) => isValueEqual(transformValue(current), item));
          })
          .filter((val: any) => val),
      );
    } else {
      triggerChange(value);
    }
  };

  const tableProps: TableProps<any> = {};

  const rowSelectionProps = tableRowSelection?.() || {};

  const isValueEqual = (val: ChangeValue, newVal: ChangeValue): boolean => {
    if (isString(val) && isString(newVal)) {
      return val === newVal;
    }

    if (
      typeof val !== 'string' &&
      typeof newVal !== 'string' &&
      isObject(val) &&
      isObject(newVal)
    ) {
      return val?.value === newVal?.value;
    }

    if (typeof newVal !== 'string' && isString(val) && isObject(newVal)) {
      return val === newVal?.value;
    }

    if (typeof val !== 'string' && isObject(val) && isString(newVal)) {
      return val?.value === newVal;
    }

    return false;
  };

  const rowSelection: TableProps<any>['rowSelection'] = {
    selectedRowKeys,
    onChange: (rowKeys: Key[], selectedRows: any[], ...rest) => {
      const [...oldValue] = value || [];

      const allDataSourceKey = dataSource.map((item) => item.value);

      setSelectValue(
        selectedRows
          .concat(
            selectValue.filter((item: any) => {
              return !selectedRows.find((current) =>
                isValueEqual(transformValue(current), transformValue(item)),
              );
            }),
          )
          .filter((val) => val),
      );

      const mapValue = oldValue
        .map((val: any) => {
          return selectValue.find((item) =>
            isValueEqual(transformValue(item), transformValue(val)),
          );
        })
        .filter((val: any) => val);

      const changeValue = mapValue
        .filter((item: any) => !allDataSourceKey.includes(item.value))
        .concat(selectedRows.filter((item) => allDataSourceKey.includes(item.value)));

      triggerChange(changeValue);

      setSelectedRowKeys(changeValue.map((item: any) => item.value));

      rowSelectionProps?.onChange?.(rowKeys, selectedRows, ...rest);
    },
    ...rowSelectionProps,
  };

  if (isFunction(tableCheckboxProps)) {
    rowSelection.getCheckboxProps = tableCheckboxProps;
  }

  if (isMultiple) {
    tableProps.rowSelection = rowSelection;
  } else {
    tableProps.onRow = handleRow;
  }

  const dropdownRender = () => {
    return (
      <Spin spinning={loading}>
        <div className="select-table-container" ref={containerRef}>
          {showSearch ? (
            <Space size="large">
              <Button style={{ marginLeft: '10px' }} type="primary" onClick={handleSearchClick}>
                查询
              </Button>
            </Space>
          ) : null}

          <Table
            rowKey="value"
            dataSource={dataSource}
            columns={
              columns?.map((item) => {
                // @ts-ignore
                const { dataIndex, title, width } = item;

                return {
                  ...item,
                  title,
                  ellipsis: true,
                  width: width ?? 100,
                  render: (text: any, record: any, rowIndex: number) => {
                    if (renderTableCell?.[dataIndex]) {
                      return renderTableCell[dataIndex](text, record, rowIndex);
                    }
                    return text;
                  },
                };
              }) || []
            }
            size="small"
            pagination={false}
            {...tableProps}
            scroll={{
              y: 400,
              x: scrollX,
            }}
          />
          <TablePagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
            pageSizeOptions={['5', '10', '20']}
          />
        </div>
      </Spin>
    );
  };

  useEffect(() => {
    setIsExactSearch(false);
  }, [value]);

  const displayValue = useMemo(() => {
    if (!value) return value;

    const mapValue = toArray(value).map((val: string) => {
      const record = selectValue.find((item) =>
        isValueEqual(transformValue(item), transformValue(val)),
      );
      return record || val;
    });

    if (!isExactSearch) {
      const codes = mapValue.filter((item: any) => isString(item));
      if (codes.length) {
        exactSearch(codes);
      }
    }

    if (isMultiple) {
      return mapValue.map((item: any) => {
        if (isString(item)) {
          return {
            value: item,
            label: item,
          };
        }
        return item;
      });
    }

    return value;
  }, [value, selectValue, isExactSearch]);

  if (!editable) {
    return <span>{value}</span>;
  }

  return (
    <Select
      allowClear
      dropdownStyle={{
        minWidth: 260,
      }}
      {...restProps}
      mode={mode}
      style={{ width: '100%' }}
      disabled={disabled}
      dropdownRender={dropdownRender}
      showSearch={showSearch}
      onSearch={handleSearch}
      onFocus={handleFocus}
      options={selectValue}
      value={displayValue}
      onChange={handleChange}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      ref={selectRef}
      labelInValue={isMultiple}
      placeholder={placeholder}
    />
  );
};

SelectTable.defaultProps = {
  optionLabelProp: 'label',
  showSearch: true,
  editable: true,
  keywordKey: 'value',
  valueTemplateKey: 'code',
  labelTemplateKey: 'name',
  exactQueryParamKey: 'code',
};

export default SelectTable;

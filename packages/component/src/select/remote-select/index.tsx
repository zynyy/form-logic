import { FC, useEffect, useState } from 'react';

import { getPathValue, transformToOptions } from '@/utils';
import { getData } from '@/service';
import isEqual from 'lodash.isequal';
import { ApiConfig, DataIndex } from '@/interface';
import StaticSelect, { StaticSelectProps } from '@/select/static-select';
import { isNumber } from '@/utils/is';
import { strNumBoolToBoolean } from '@/utils';

export interface RemoteSelectProps<V = any> extends Omit<StaticSelectProps, 'data'> {
  remoteDataPath?: DataIndex;
  apiConfig?: ApiConfig;
  defaultFirstOptionValue?: boolean;
}

const RemoteSelect: FC<RemoteSelectProps> = ({
  valueTemplateKey,
  labelTemplateKey,
  onChange,
  value,
  remoteDataPath,
  apiConfig,
  defaultFirstOptionValue,
  ...restProps
}) => {
  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState<any[]>([]);

  const [prevApi, setPrevApi] = useState<any>(apiConfig);

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

  const transformPath = (path: DataIndex): Array<string | number> => {
    if (Array.isArray(path)) {
      return path;
    }

    if (isNumber(path)) {
      return [path];
    }

    if (path && typeof path === 'string') {
      return path?.split('.');
    }

    return ['data'];
  };

  const search = () => {
    if (!apiConfig || !(apiConfig && apiConfig.url)) {
      return;
    }

    setLoading(true);
    getData(apiConfig)
      .then((res) => {
        setLoading(false);

        const remoteData = getPathValue(res, transformPath(remoteDataPath));
        const newData = remoteData ? transformData(remoteData) : [];
        setDataSource(newData);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleFocus = () => {
    if (!dataSource.length) {
      search();
    }
  };

  useEffect(() => {
    if (!dataSource.length && value) {
      search();
    }
  }, [value, dataSource]);

  useEffect(() => {
    if (!isEqual(apiConfig, prevApi)) {
      if (value) {
        search();
      } else if (dataSource.length) {
        setDataSource([]);
      }
      setPrevApi(apiConfig);
    }
  }, [apiConfig, prevApi, dataSource, value]);

  useEffect(() => {
    if (
      strNumBoolToBoolean(defaultFirstOptionValue) &&
      value !== 0 &&
      !value &&
      dataSource.length &&
      isEqual(apiConfig, prevApi)
    ) {
      triggerChange(dataSource[0].value);
    }
  }, [defaultFirstOptionValue, dataSource, apiConfig, prevApi, value]);

  return (
    <StaticSelect
      {...restProps}
      value={value}
      onChange={onChange}
      data={dataSource}
      loading={loading}
      onFocus={handleFocus}
    />
  );
};

export default RemoteSelect;

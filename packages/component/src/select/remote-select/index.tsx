import { FC, useEffect, useRef, useState } from 'react';

import { getPathValue, strNumBoolToBoolean } from '@/utils';
import { getData } from '@/service';
import isEqual from 'lodash.isequal';
import { ApiConfig, DataIndex } from '@/interface';
import StaticSelect, { StaticSelectProps } from '@/select/static-select';
import { isNumber } from '@/utils/is';
import { BackEndData } from '@/utils/request';

export interface RemoteSelectProps<V = any> extends Omit<StaticSelectProps, 'data'> {
  remoteDataPath?: DataIndex;
  apiConfig?: ApiConfig;
  defaultFirstOptionValue?: boolean;
}

const RemoteSelect: FC<RemoteSelectProps> = ({
  value,
  remoteDataPath,
  apiConfig,
  defaultFirstOptionValue,
  ...restProps
}) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  const [prevApi, setPrevApi] = useState<any>(apiConfig);

  const loadingRef = useRef(false);

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
    if (!apiConfig || !(apiConfig && apiConfig.url) || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    getData(apiConfig)
      .then((res) => {
        loadingRef.current = false;
        const remoteData = getPathValue<any[], BackEndData>(res, transformPath(remoteDataPath));
        const newData = remoteData ? remoteData : [];
        setDataSource(newData);
      })
      .catch(() => {
        loadingRef.current = false;
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
      setDataSource([]);
      if (value) {
        search();
      }
      setPrevApi(apiConfig);
    }
  }, [apiConfig, prevApi, value]);

  return (
    <StaticSelect
      {...restProps}
      value={value}
      data={dataSource}
      loading={loadingRef.current}
      onFocus={handleFocus}
      defaultFirstOptionValue={
        strNumBoolToBoolean(defaultFirstOptionValue) && isEqual(apiConfig, prevApi)
      }
    />
  );
};

export default RemoteSelect;

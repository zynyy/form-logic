import { cloneDeep, merge } from 'lodash-es';
import qs from 'qs';
import { Ref, onMounted, reactive, ref, watch } from 'vue';

import { backEndPageStructure, getPageParams } from '@/config';
import { useSchemeFormContent } from '@/renderer-layout/scheme-form/hooks';
import {
  ApiConfigPropsType,
  compileTpl,
  getPathData,
  getPathValue,
  request,
  transformPath,
  transformToOptions,
} from '@/utils';
import { BackEndData, RequestConfig } from '@/utils/request';

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface ApiConfigRequestReturn {
  dataSource: Ref<any[]>;
  pagination: Pagination;
  handlePageChange: (pageConfig?: Partial<Pagination>) => void;
  reRequest: () => void;
}

export const useApiConfigRequest = (
  props: ApiConfigPropsType,
  isMountFetch = true,
): ApiConfigRequestReturn => {
  const dataSource = ref<any[]>([]);

  const formContent = useSchemeFormContent();

  const pagination = reactive<Pagination>({
    current: props.defaultPage ?? 1,
    pageSize: props.defaultPageSize ?? 30,
    total: 0,
  });

  const fetchPageData = (nextCurrent?: number, nextPageSize?: number) => {
    const {
      apiConfig: searchApiConfig,
      transformApiConfig,
      transformDataSource,
      hasPagination,
      labelTemplateKey,
      valueTemplateKey,
    } = props;

    const urlQuery = qs.parse(new URLSearchParams(location.search).toString());

    const { record } = formContent.value.extraLogicParams || {};

    if (searchApiConfig && searchApiConfig.url) {
      const { current, pageSize } = pagination;

      const pageParams = getPageParams(
        nextCurrent ?? current,
        nextPageSize ?? pageSize,
        hasPagination,
      );

      const method = searchApiConfig?.method ?? 'post';

      const nextSearchParams = method === 'get' ? pageParams : pageParams;

      const apiConfig: RequestConfig = compileTpl(
        merge(
          {
            noLoading: true,
            method,
            params: method === 'get' ? nextSearchParams : pageParams,
            data: method === 'get' ? {} : nextSearchParams,
          },
          searchApiConfig,
        ),
        {
          record: record ?? {},
          query: urlQuery,
        },
      );

      const nextConfig = transformApiConfig ? transformApiConfig?.(apiConfig) : apiConfig;

      request(nextConfig).then((res) => {
        const {
          list,
          currentPage: current,
          pageSize: size,
          total,
        } = getPathData(backEndPageStructure, res);

        pagination.current = Number(current);
        pagination.pageSize = Number(size);
        pagination.total = Number(total);

        const options = transformToOptions(list, labelTemplateKey, valueTemplateKey);

        dataSource.value = transformDataSource ? transformDataSource(options) : options;
      });
    }
  };

  const fetchData = () => {
    const {
      apiConfig: searchApiConfig,
      transformApiConfig,
      transformDataSource,
      remoteDataPath,
      labelTemplateKey,
      valueTemplateKey,
    } = props;

    const urlQuery = qs.parse(new URLSearchParams(location.search).toString());

    const { record } = formContent.value.extraLogicParams || {};

    if (searchApiConfig && searchApiConfig.url) {
      const apiConfig = compileTpl(searchApiConfig, {
        record: record ?? {},
        query: urlQuery,
      });

      const nextConfig = transformApiConfig ? transformApiConfig?.(apiConfig) : apiConfig;

      request(nextConfig).then((res) => {
        const remoteData = getPathValue<any[], BackEndData>(res, transformPath(remoteDataPath));

        const nextData = remoteData ? remoteData : [];

        const options = transformToOptions(nextData, labelTemplateKey, valueTemplateKey);

        dataSource.value = transformDataSource ? transformDataSource(options) : options;
      });
    }
  };

  watch(
    () => JSON.stringify(cloneDeep(props.apiConfig)),
    () => {
      fetchData();
    },
  );

  const reRequest = () => {
    if (props.hasPagination) {
      fetchPageData();
    } else {
      fetchData();
    }
  };

  onMounted(() => {
    if (isMountFetch) {
      reRequest();
    }
  });

  const handlePageChange = (pageConfig?: Partial<Pagination>) => {
    if (pageConfig) {
      const { current, pageSize } = pageConfig;
      fetchPageData(current, pageSize);
    } else {
      fetchData();
    }
  };

  return {
    dataSource,
    pagination,
    handlePageChange,
    reRequest,
  };
};

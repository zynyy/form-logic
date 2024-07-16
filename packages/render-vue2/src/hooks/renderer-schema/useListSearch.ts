import { Form, getSubmitFormValues, uid } from '@formlogic/render-core-vue2';
import { merge } from 'lodash-es';
import { Ref, reactive, ref } from 'vue';

import { backEndPageStructure, getPageParams } from '@/config';
import { useCacheWhere } from '@/hooks';
import { getPathData } from '@/utils';
import request, { BackEndData, RequestConfig } from '@/utils/request';

import useSearchWhereTagGroups from './useSearchWhereTagGroups';

export interface ListSearchConfig {
  defaultPage?: number;
  defaultPageSize?: number;
  cacheKey?: string;
  hasPagination?: boolean;
  searchApiConfig?: RequestConfig;
  hasCacheWhere?: boolean;
  hasInitRequest?: boolean;
  transformSearchApiConfig?: (config: RequestConfig) => RequestConfig;
  onSearchDone?: (data: any[]) => void;
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  total: number;
}

const useListSearch = (getConfig: () => ListSearchConfig, form: Ref<Form>) => {
  const searchLoading = ref(false);

  const config = getConfig();

  const defaultPage = ref(config.defaultPage ?? 1);

  const dataSource = ref<any[]>([]);

  const searchFormValues = ref({});

  const getCacheKey = () => {
    return getConfig().cacheKey ?? uid();
  };

  const [setCache, getCache] = useCacheWhere(getCacheKey);

  const [tagGroups, setTagGroups] = useSearchWhereTagGroups(form, searchFormValues);

  const paginationRef = reactive<PaginationConfig>({
    currentPage: defaultPage.value,
    pageSize: config.defaultPageSize ?? 30,
    total: 0,
  });

  const setSearchLoading = (nextLoading: boolean) => {
    searchLoading.value = nextLoading;
  };

  const setPagination = (pageConfig: Partial<PaginationConfig>) => {
    Object.keys(pageConfig).forEach((key) => {
      const pageKey = key as keyof PaginationConfig;

      paginationRef[pageKey] = Number(pageConfig[pageKey]);
    });
  };

  const search = (nextCurrent: number, nextPageSize: number) => {
    const searchForm = form.value;
    getSubmitFormValues(searchForm).then((formValues) => {
      searchFormValues.value = formValues;

      fetchList(nextCurrent, nextPageSize);
    });
  };

  const fetchList = (nextCurrent: number, nextPageSize: number) => {
    const { hasPagination, searchApiConfig, transformSearchApiConfig } = getConfig();

    if (!searchApiConfig || !searchApiConfig.url) {
      return;
    }

    const { currentPage, pageSize } = paginationRef;

    const pageParams = getPageParams(
      nextCurrent ?? currentPage,
      nextPageSize ?? pageSize,
      hasPagination,
    );

    const method = searchApiConfig.method ?? 'post';

    const nextSearchParams =
      method === 'get'
        ? {
            ...searchFormValues.value,
            ...pageParams,
          }
        : {
            ...searchFormValues.value,
            ...pageParams,
          };

    const apiConfig: RequestConfig = merge(
      {
        noLoading: true,
        method,
        params: method === 'get' ? nextSearchParams : pageParams,
        data: method === 'get' ? {} : nextSearchParams,
      },
      searchApiConfig,
    );

    const nextConfig = transformSearchApiConfig?.(apiConfig) || apiConfig;
    setSearchLoading(true);
    request(nextConfig)
      .then((res: BackEndData) => {
        const { data } = res || {};
        setSearchLoading(false);
        if (hasPagination) {
          const {
            list,
            currentPage: current,
            pageSize: size,
            total,
          } = getPathData(backEndPageStructure, res);

          setPagination({
            currentPage: current,
            pageSize: size,
            total,
          });

          const searchParams = method === 'get' ? nextConfig.params : nextConfig.data;
          setCache({
            current,
            pageSize,
            params: searchParams,
          });

          dataSource.value = list;
        } else {
          dataSource.value = data;
        }

        const { onSearchDone } = config || {};

        onSearchDone?.(dataSource.value);

        setTagGroups();
      })
      .catch(() => {
        setSearchLoading(false);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  const initSearch = () => {
    const { hasCacheWhere, hasInitRequest } = getConfig();

    const searchForm = form.value;
    if (!hasInitRequest) {
      return;
    }
    const { pageSize } = paginationRef;
    if (hasCacheWhere) {
      const { current, pageSize: nextPageSize, params } = getCache();

      searchForm.setValues(params);

      search(current || defaultPage.value, pageSize || nextPageSize);
    } else {
      search(defaultPage.value, pageSize);
    }
  };

  return {
    tagGroups,
    searchLoading,
    setSearchLoading,
    pagination: paginationRef,
    getCache,
    search,
    setPagination,
    fetchList,
    defaultCurrentPage: defaultPage,
    dataSource,
    initSearch,
  };
};

export default useListSearch;

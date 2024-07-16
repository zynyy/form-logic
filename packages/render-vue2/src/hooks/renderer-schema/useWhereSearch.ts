import { Form, fieldResetValue, isField } from '@formlogic/render-core-vue2';
import { Ref } from 'vue';

import useListSearch, { ListSearchConfig } from '@/hooks/renderer-schema/useListSearch';

export interface WhereSearchConfig extends ListSearchConfig {}

const useWhereSearch = (getConfig: () => WhereSearchConfig, form: Ref<Form>) => {
  const {
    tagGroups,
    search,
    pagination,
    setSearchLoading,
    setPagination,
    searchLoading,
    defaultCurrentPage,
    dataSource,
    initSearch,
    fetchList,
  } = useListSearch(getConfig, form);

  const handleCloseTag = (record: Record<string, any>) => {
    const { value } = record;

    const searchForm = form.value;

    if (value) {
      fieldResetValue(searchForm, [value]);
      handleSearch();
    }
  };

  const handleRestClick = () => {
    const searchForm = form.value;
    searchForm.reset().then(() => void 0);
    const { pageSize } = pagination;
    search(1, pageSize);
  };

  const handleCollapsedClick = (collapsed: boolean) => {
    const searchForm = form.value;
    searchForm.query('*').forEach((target) => {
      if (isField(target) && target?.data?.hiddenSearchColumn) {
        target.setDisplay(collapsed ? 'visible' : 'hidden');
        if (collapsed) {
          target.reset().then(() => void 0);
        }
      }
    });
  };

  const handleSearch = () => {
    search(defaultCurrentPage.value, pagination.pageSize);
  };

  return {
    tagGroups,
    search: fetchList,
    pagination,
    setSearchLoading,
    setPagination,
    searchLoading,
    defaultCurrentPage,
    dataSource,
    initSearch,
    onTagClose: handleCloseTag,
    onResetClick: handleRestClick,
    onCollapsedClick: handleCollapsedClick,
    onSearchClick: handleSearch,
  };
};

export default useWhereSearch;

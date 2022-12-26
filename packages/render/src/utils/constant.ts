export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 1.5;
export const ZOOM_STEP = 0.1;

export const ECMA_STRING_TAG = {
  error: '[object Error]',
  function: '[object Function]',
  array: '[object Array]',
};

export const LIST_FILED_CODE = 'tableDataSource';

export const MONACO_EDITOR_PATHS_VS = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs';

export const DEFAULT_TABLE_PAGINATION = {
  current: 1,
  total: 0,
  pageSize: 30,
  showSizeChanger: true,
  pageSizeOptions: ['30', '50', '100'],
  showTotal: (total, range) => `总计${total}条; 当前页第${range[0]}到${range[1]}条`,
};

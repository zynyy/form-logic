export interface BackEndPageStructure {
  list: string;
  currentPage: string;
  pageSize: string;
  total: string;
  currentPageKey: string;
  pageSizeKey: string;
  totalPages: string;
}

export type BackEndPageKey = keyof BackEndPageStructure;

export const backEndPageStructure: BackEndPageStructure = {
  list: 'data.records',
  currentPage: 'data.current',
  pageSize: 'data.size',
  total: 'data.total',
  currentPageKey: 'pageNumber',
  pageSizeKey: 'pageSize',
  totalPages: 'data.pages',
};

export const registerBackEndPageStructure = (
  config: Partial<BackEndPageStructure>,
) => {
  Object.keys(config).forEach((key) => {
    const keyType = key as BackEndPageKey;

    backEndPageStructure[keyType] = config[keyType] as string;
  });
};

export const getPageParams = (
  current: number,
  pageSize: number,
  hasPagination?: boolean,
) => {
  return hasPagination
    ? {
        [backEndPageStructure.pageSizeKey ?? 'pageNumber']: pageSize,
        [backEndPageStructure.currentPageKey ?? 'pageSize']: current,
      }
    : {};
};

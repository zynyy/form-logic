export const LOGIN_INFO_STORAGE_KEY = 'use-info';

export const AUTO_LOGIN_KEY = 'auto-login';

export const REMEMBER_PASSWORD_KEY = 'remember-password';

export const REMEMBER_USER_KEY = 'remember-user';

export const DEFAULT_FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export const DEFAULT_TABLE_PADINATION = {
  current: 1,
  total: 0,
  pageSize: 30,
  size: 'small',
  showTotal: (total, range) => `第${range[0]}到${range[1]}条,总计${total}条`,
  showSizeChanger: true,
  pageSizeOptions: ['30', '50', '100'],
};

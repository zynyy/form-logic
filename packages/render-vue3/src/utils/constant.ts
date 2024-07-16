export enum ComponentTypeEnum {
  container = 'container',
  button = 'button',
  array = 'array',
  object = 'object',
  string = 'string',
}

export interface ConstantDataItem {
  code?: string;
  name: string;
  key?: string;
  options?: ConstantDataItem[];
}

export enum MetaDataTypeEnum {
  column = 'column', // 字段
  table_column = 'table_column', // 列表字段
  detail_table_column = 'detail_table_column', // 列表字段
  search_column = 'search_column', // 搜索字段
  button = 'button', // 按钮
  table_button = 'table_button', // 表格按钮
  detail_table_button = 'detail_table_button', // 表格按钮
  search_button = 'search_button', // 搜索按钮
  container = 'container', // 容器
}

export enum RequestMethodEnum {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete',
}

export enum SchemaTypeEnum {
  string = 'string',
  object = 'object',
  array = 'array',
  void = 'void',
}

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 1.5;
export const ZOOM_STEP = 0.1;

export const STYLE_PREFIX = 'cube-form';

export const ECMA_STRING_TAG = {
  error: '[object Error]',
  function: '[object Function]',
  array: '[object Array]',
  number: '[object Number]',
};

export const LIST_FILED_CODE = 'tableDataSource';

export const MONACO_EDITOR_PATHS_VS = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs';

export const DEFAULT_TABLE_PAGINATION = {
  current: 1,
  total: 0,
  pageSize: 30,
  showSizeChanger: true,
  pageSizeOptions: ['30', '50', '100'],
  size: 'small',
  showTotal: (total: number, range: number[]) =>
    `总计${total}条; 当前页第${range[0]}到${range[1]}条`,
};

export const YSE_OR_DATA = [
  {
    code: '1',
    name: '是',
  },
  {
    code: '0',
    name: '否',
  },
];

export const SCHEMA_TYPE_DATA = [
  {
    code: SchemaTypeEnum.string,
    name: 'Field模型',
  },
  {
    code: SchemaTypeEnum.object,
    name: 'ObjectField模型',
  },
  {
    code: SchemaTypeEnum.array,
    name: 'ArrayField模型',
  },
  {
    code: SchemaTypeEnum.void,
    name: 'VoidField模型',
  },
];

export const TABS_GROUP_MODE = 'tabs';
export const STEPS_GROUP_MODE = 'steps';

export const OPERATIONS_PROP = '$operations';

export const GROUP_MODE = [
  {
    code: TABS_GROUP_MODE,
    name: '标签页',
  },
  {
    code: STEPS_GROUP_MODE,
    name: '分步',
  },
];

export const VALIDATOR_TRIGGER = [
  { code: 'onInput', name: '输入时' },
  { code: 'onFocus', name: '聚焦时' },
  { code: 'onBlur', name: '失焦时' },
];

export const FIELD_TYPE_DATA = [
  {
    code: MetaDataTypeEnum.column,
    name: '字段',
  },
  {
    code: MetaDataTypeEnum.table_column,
    name: '表格字段',
  },
  {
    code: MetaDataTypeEnum.search_column,
    name: '搜索字段',
  },
  {
    code: MetaDataTypeEnum.button,
    name: '按钮',
  },
  {
    code: MetaDataTypeEnum.table_button,
    name: '表格按钮',
  },
  {
    code: MetaDataTypeEnum.search_button,
    name: '搜索按钮',
  },
  {
    code: MetaDataTypeEnum.container,
    name: '容器节点',
  },
];

export const COMPONENT_TYPE_DATA = [
  {
    code: ComponentTypeEnum.string,
    name: '字段类',
  },
  {
    code: ComponentTypeEnum.array,
    name: '数组类',
  },
  {
    code: ComponentTypeEnum.object,
    name: '对象类',
  },
  {
    code: ComponentTypeEnum.button,
    name: '按钮类',
  },
  {
    code: ComponentTypeEnum.container,
    name: '容器类',
  },
];

export const REQUEST_METHOD = [
  {
    code: RequestMethodEnum.get,
    name: 'GET',
  },
  {
    code: RequestMethodEnum.post,
    name: 'POST',
  },
  {
    code: RequestMethodEnum.delete,
    name: 'DELETE',
  },
  {
    code: RequestMethodEnum.put,
    name: 'PUT',
  },
];

export const ROW_SELECTION_TYPE = [
  {
    code: 'checkbox',
    name: '多选',
  },
  {
    code: 'radio',
    name: '单选',
  },
];

export const SELECT_MODE = [
  {
    code: 'multiple',
    name: '多选',
  },
  {
    code: 'tags',
    name: '标签',
  },
];

export const EFFECT_HOOK_GROUP: ConstantDataItem[] = [
  {
    name: '字段事件',
    key: 'field',
    options: [
      { name: '字段初始化', code: 'onFieldInit' },
      { name: '字段挂载', code: 'onFieldMount' },
      { name: '字段值输入变化', code: 'onFieldInputValueChange' },
      { name: '字段值变化', code: 'onFieldValueChange' },
      { name: '字段属性变化', code: 'onFieldChange' },
      { name: '字段依赖数据变化', code: 'onFieldReact' },
      { name: '字段卸载', code: 'onFieldUnmount' },
    ],
  },
  {
    name: '鼠标事件',
    key: 'mouse',
    options: [{ name: '点击', code: 'onClick' }],
  },
  {
    name: '表单事件',
    key: 'form',
    options: [
      { name: '表单值输入变化', code: 'onFormInputValueChange' },
      { name: '表单值变化', code: 'onFormValueChange' },
    ],
  },
];

export const VALIDATE_RULES = [
  {
    code: 'exclusiveMinimum',
    name: '最小值(不包含本身)',
  },
  {
    code: 'minimum',
    name: '最小值',
  },
  {
    code: 'exclusiveMaximum',
    name: '最大值(不包含本身)',
  },
  {
    code: 'maximum',
    name: '最大值',
  },
  {
    code: 'len',
    name: '固定长度',
  },
  {
    code: 'minLength',
    name: '最小长度',
  },
  {
    code: 'maxLength',
    name: '最大长度',
  },
  {
    code: 'whitespace',
    name: '不得是纯空白字符',
  },
  {
    code: 'pattern',
    name: '正则表达式匹配',
  },
  {
    code: 'url',
    name: '校验是否是url格式',
  },
  {
    code: 'email',
    name: '校验是否是邮箱格式',
  },
  {
    code: 'date',
    name: '校验是否是日期格式',
  },
  {
    code: 'number',
    name: '校验是否是数字',
  },
  {
    code: 'integer',
    name: '校验是否是正整数',
  },
  {
    code: 'phone',
    name: '校验是否是手机号码',
  },
  {
    code: 'ip',
    name: '校验是否是ip格式',
  },
  {
    code: 'codingRules',
    name: '编码规则',
  },
  {
    code: 'originDomain',
    name: '域名校验',
  },
  {
    code: 'pathname',
    name: '路径校验',
  },
  {
    code: 'startLetterNumUnderline',
    name: '字母开头、仅包含大小写字母+数字+下划线',
  },
  {
    code: 'startLetterNumSpecialCharacters',
    name: '字母开头、仅包含大小写字母+数字+特殊字符',
  },
  {
    code: 'remoteCheckUniq',
    name: '远程校验唯一性',
    params: {
      apiConfig: {
        url: '',
        method: '',
        data: {},
        params: {},
      },
    },
  },
];

export const URL_REG_EXP = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/g;

export const INVOKE_MAP_KEY = {};

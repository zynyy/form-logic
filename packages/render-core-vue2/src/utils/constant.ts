export interface ConstantDataItem {
  code?: string;
  name: string;
  key?: string;
  options?: ConstantDataItem[];
}

export enum SchemaTypeEnum {
  string = 'string',
  object = 'object',
  array = 'array',
  void = 'void',
}

export const ECMA_STRING_TAG = {
  error: '[object Error]',
  function: '[object Function]',
  array: '[object Array]',
  number: '[object Number]',
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

export const VALIDATOR_TRIGGER = [
  { code: 'onInput', name: '输入时' },
  { code: 'onFocus', name: '聚焦时' },
  { code: 'onBlur', name: '失焦时' },
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
];

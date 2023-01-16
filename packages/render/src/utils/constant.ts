import {
  ComponentTypeEnum,
  ConstantDataItem,
  MetaDataTypeEnum,
  RequestMethodEnum,
  SchemaTypeEnum,
} from '@/interface';
import { PaginationProps } from 'antd';

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

export const DEFAULT_TABLE_PAGINATION: PaginationProps = {
  current: 1,
  total: 0,
  pageSize: 30,
  showSizeChanger: true,
  pageSizeOptions: ['30', '50', '100'],
  size: 'small',
  showTotal: (total, range) => `总计${total}条; 当前页第${range[0]}到${range[1]}条`,
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

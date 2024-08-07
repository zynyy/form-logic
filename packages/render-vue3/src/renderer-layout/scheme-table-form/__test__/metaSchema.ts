import { MetaSchema } from '@/interface';

export default {
  code: 'Logic_L',
  name: '逻辑列表',
  model: 'Logic',
  labelCol: 6,
  wrapperCol: 18,
  columnLayout: 3,
  group: [],
  defaultSearchColumn: 6,
  data: [
    {
      code: 'code',
      name: '编码',
      type: 'search_column',
      schemaType: 'string',
      logics: [],
    },
    {
      code: 'name',
      name: '名称',
      type: 'search_column',
      schemaType: 'string',
      logics: [],
    },
    {
      code: 'addBtn',
      name: '新建',
      type: 'button',
      schemaType: 'void',
      component: 'ArrayBase.Addition',
      logics: [],
    },
    {
      code: 'code',
      name: '编码',
      type: 'table_column',
      schemaType: 'string',
      logics: [],
    },
    {
      code: 'name',
      name: '名称',
      type: 'table_column',
      schemaType: 'string',
      logics: [],
    },
    {
      code: 'remarks',
      name: '备注说明',
      type: 'table_column',
      schemaType: 'string',
      logics: [],
    },
    {
      code: 'editBtn',
      name: '编辑',
      type: 'table_button',
      schemaType: 'void',
      component: 'ArrayBase.Edit',
      logics: [],
    },
    {
      code: 'removeBtn',
      name: '删除',
      type: 'table_button',
      schemaType: 'void',
      component: 'ArrayBase.Remove',
      logics: [],
    },
    {
      type: 'table_button',
      schemaType: 'string',
      required: '0',
      hidden: '0',
      disabled: '0',
      logics: [],
      code: 'detailBtn',
      name: '详情',
      component: 'ArrayBase.Detail',
    },
  ],
} as MetaSchema;

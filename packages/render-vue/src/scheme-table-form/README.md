# SchemeTableForm

### 介绍

表格配置

### 引入

通过以下方式来注册组件。 注册完成后，在模板中通过 `<scheme-table-form>` 或 `<SchemeTableForm>` 标签来使用组件

```js
import { createApp } from 'vue';
import { schemeTableFormPlugin } from '@formlogic/render-vue';

// 全局方式
const app = createApp();
app.use(schemeTableFormPlugin);

// <script setup>

<script setup>
import { SchemeTableForm } from '@formlogic/render-vue';
</script>

<template>
  <SchemeTableForm />
</template>

// JSX/TSX

import { SchemeTableForm } from '@formlogic/render-vue';

export default {
  render() {
    return <SchemeTableForm />;
  },
};

```

## 用法

### 基础用法

```vue
<template>
  <scheme-table-form :schema="schema" :form="form" />
</template>

<script setup>
import getLogicConfig from '@/low-code-meta/logic';
import { useCreateForm } from '@formlogic/render-vue';
const action = '/xx/xx';

const [form] = useCreateForm(
  ref({
    formConfig: {
      values: {},
    },
  }),
);

const metaSchema = {
  code: 'Model_L',
  name: '模型列表',
  model: 'Model',
  labelCol: 6,
  wrapperCol: 18,
  columnLayout: 3,
  group: [],
  data: [
    { code: 'code', name: '编码', type: 'search_column', schemaType: 'string' },
    { code: 'name', name: '名称', type: 'search_column', schemaType: 'string' },
    {
      code: 'addBtn',
      name: '新建',
      type: 'button',
      schemaType: 'void',
      hiddenName: '0',
      component: 'ArrayBase.Addition',
      eventCode: 'onAdd',
    },
    { code: 'code', name: '编码', type: 'table_column', schemaType: 'string' },
    { code: 'name', name: '名称', type: 'table_column', schemaType: 'string' },
    {
      code: 'editBtn',
      name: '编辑',
      type: 'table_button',
      schemaType: 'void',
      component: 'ArrayBase.Edit',
      eventCode: 'onEdit',
    },
    {
      code: 'removeBtn',
      name: '删除',
      type: 'table_button',
      schemaType: 'void',
      component: 'ArrayBase.Remove',
      eventCode: 'onRemove',
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
      eventCode: 'onDetail',
    },
  ],
  defaultSearchColumn: '6',
};
const formSchemaRef = useFormSchema(ref({ metaSchema, hasGroup: true }));
const { schema } = formSchemaRef.value;
</script>
```

## API

默认值为空属于必填属性。

### Props

| 属性                   | 描述                                                                  | 类型                                                  | 默认值   |
|----------------------| --------------------------------------------------------------------- | ----------------------------------------------------- | -------- |
| form                 | Form 实例                                                             | Form                                                  |          |
| schema               | schema 协议                                                           | ISchema                                               |          |
| dataSource           | 表格数据                                                              | any[]                                                 | []       |
| total                | 数据总数                                                              | number                                                | 0        |
| currentPage          | 当前页数                                                              | number                                                |          |
| pageSize             | 每页条数                                                              | number                                                |          |
| language             | 表单验证国际化                                                        | string                                                | zh-CN    |
| components           | 注册组件                                                              | Record<string, Component>                             | {}       |
| loading              | 页面加载                                                              | boolean                                               | false    |
| tableLoading         | 表格加载                                                              | boolean                                               | false    |
| events               | 按钮点击事件勾子映射`MetaSchema`里 `eventCode`与之对应                | Record<string, (e: MouseEvent, ...args: any) => void> | {}       |
| getLogicConfig       | 获取逻辑编码                                                          | (code: string) => Promise\<any\>                      | -        |
| selectedRows         | 表格选中的数据                                                        | any[]                                                 | -        |
| hasClearSelectedRows | 数据变化是否清除掉表格选中的数据                                      | boolean                                               | true     |
| rowSelection         | [表格行选择配置](https://ant.design/components/table-cn#rowselection) | object                                                | true     |
| hasRowSelection      | 是否开启表格行选择                                                    | boolean                                               | false    |
| scrollY              | 表格可滚动高度                                                        | number                                                | 450      |
| rowSelectionType     | 表格行选择类型                                                        | `checkbox` / `radio`                                  | checkbox |
| rowKey               | 表格行 key 的取值                                                     | string / (record: any) => string                      | -        |

### Events

| 事件        | 描述                                            | 类型                                                      |
| ----------- | ----------------------------------------------- | --------------------------------------------------------- |
| change      | 表格变更                                        | (form:Form)=>void                                         |
| add         | 表格按钮配置`ArrayBase.Addition`组件点击触发    | (modelsFiled:ModelsFiled)=>void                           |
| edit        | 表格按钮配置`ArrayBase.Edit`组件点击触发        | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| remove      | 表格按钮配置`ArrayBase.Remove`组件点击触发      | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| detail      | 表格按钮配置`ArrayBase.Detail`组件点击触发      | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| moveDown    | 表格按钮配置`ArrayBase.MoveDown`组件点击触发    | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| moveUp      | 表格按钮配置`ArrayBase.MoveUp`组件点击触发      | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| copy        | 表格按钮配置`ArrayBase.Copy`组件点击触发        | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| batchRemove | 表格按钮配置`ArrayBase.BatchRemove`组件点击触发 | (rowSelected:RowSelected, modelsFiled:ModelsFiled)=>void  |
| upload      | 表格按钮配置`ArrayBase.Upload`组件上传文件触发  | (info:UploadChangeParam, modelsFiled:ModelsFiled)=>void   |

### 类型定义

组件导出以下类型定义：

```ts
import type { SchemeFormProps } from '@formlogic/render-vue';

import { getSchemeFormProps } from '@formlogic/render-vue';

type SchemaPattern = 'EDITABLE' | 'DETAIL' | 'DISABLED';
```

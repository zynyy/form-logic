# ListCheckLayout

### 介绍

列表查询页面

### 引入

通过以下方式来注册组件。 注册完成后，在模板中通过 `<list-check-layout>` 或 `<ListCheckLayout>` 标签来使用组件

```js
import { createApp } from 'vue';
import { listLayoutPlugin } from '@formlogic/render-vue';

// 全局方式
const app = createApp();
app.use(listLayoutPlugin);

// <script setup>

<script setup>
import { ListLayout } from '@formlogic/render-vue';
</script>

<template>
  <ListLayout />
</template>

// JSX/TSX

import { ListLayout } from '@formlogic/render-vue';

export default {
  render() {
    return <ListLayout />;
  },
};

```

## 用法

### 基础用法

```vue
<template>
  <list-check-layout :get-logic-config="getLogicConfig" :action="action" :meta-schema="metaSchema" />
</template>

<script setup>
import getLogicConfig from '@/low-code-meta/logic';

const action = '/xx/xx';

const metaSchema = {
  code: 'Logic_L',
  name: '逻辑列表',
  model: 'Logic',
  labelCol: 6,
  wrapperCol: 18,
  columnLayout: 3,
  group: [],
  defaultSearchColumn: '6',
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
};
</script>
```

## API

默认值为空属于必填属性

### Props

| 属性                    | 描述                                      | 类型                                                    | 默认值   |
|-----------------------|-----------------------------------------|-------------------------------------------------------|-------|
| action                | 列表查询接口                                  | string                                                |       |
| getLogicConfig        | 获取逻辑编码                                  | (code: string) => Promise\<any\>                      |       |
| metaSchema            | 页面字段配置描述                                | MetaSchema                                            | -     |
| pageCode              | 获取`low-code-meta/model-page`下的 json 文件  | string                                                | -     |
| language              | 表单验证国际化语言                               | string                                                | zh-CN |
| reloadFlag            | 值变化触发列表查询                               | number                                                | -     |
| extraSearchParams     | 额外查询参数                                  | Record<string, any>                                   | {}    |
| transformSearchParams | 转换查询参数                                  | (params: object) => object                            | -     |
| components            | 注册组件                                    | Record<string, Component>                             | {}    |
| formConfig            | 查询表单配置                                  | IFormProps                                            | -     |
| loading               | 页面加载                                    | boolean                                               | false |
| selectedRows               | 默认选中数据                                  | any[]                                                 | []    |
| rowKey               | 表格行 key 的取值                             | string ｜ (record: any) => string                      | []    |
| hasClearSelectedRows               | 数据变化是否清除掉表格选中的数据                        | string ｜ (record: any) => string                      | []    |
| events                | 按钮点击事件勾子映射`MetaSchema`里 `eventCode`与之对应 | Record<string, (e: MouseEvent, ...args: any) => void> | {}    |
| extraLogicParams                | 逻辑流程额外参数                                | Record<string, any>                                   | -     |
| rowSelection         | [表格行选择配置](https://ant.design/components/table-cn#rowselection) | object                                                | true     |

### Events

| 事件        | 描述                                            | 类型                                                      |
| ----------- | ----------------------------------------------- | --------------------------------------------------------- |
| tableMount  | 监听列表表单已挂载                              | (form:Form)=>void                                         |
| searchMount | 监听搜索表单已挂载                              | (form:Form) => void                                       |
| add         | 列表按钮配置`ArrayBase.Addition`组件点击触发    | (modelsFiled:ModelsFiled)=>void                           |
| edit        | 列表按钮配置`ArrayBase.Edit`组件点击触发        | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| remove      | 列表按钮配置`ArrayBase.Remove`组件点击触发      | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| detail      | 列表按钮配置`ArrayBase.Detail`组件点击触发      | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| moveDown    | 列表按钮配置`ArrayBase.MoveDown`组件点击触发    | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| moveUp      | 列表按钮配置`ArrayBase.MoveUp`组件点击触发      | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| copy        | 列表按钮配置`ArrayBase.Copy`组件点击触发        | (index:number, record:any, modelsFiled:ModelsFiled)=>void |
| batchRemove | 列表按钮配置`ArrayBase.BatchRemove`组件点击触发 | (rowSelected:RowSelected, modelsFiled:ModelsFiled)=>void  |
| upload      | 列表按钮配置`ArrayBase.Upload`组件上传文件触发  | (info:UploadChangeParam, modelsFiled:ModelsFiled)=>void   |

### 类型定义

组件导出以下类型定义：

```ts
import type { ListLayoutProps } from '@formlogic/render-vue';

import { getListLayoutProps } from '@formlogic/render-vue';

interface ModelsFiled {
  field: VoidField;
  form: Form;
  arrayField: ArrayField;
}

interface RowSelected {
  selectedRowKeys: string[];
  setSelectedRowKeys: (selectedRowKeys: string[]) => void;
  selectedRows: any[];
  setSelectedRows: (selectedRows: any[]) => void;
}

interface IFormProps {
  values?: Record<string, any>;
  initialValues?: Record<string, any>;
  effects?: (form: Form<T>) => void;
}

```

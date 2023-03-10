# FormPageLayout

### 介绍

表单页面

### 引入

通过以下方式来注册组件。 注册完成后，在模板中通过 `<form-page-layout>` 或 `<FormPageLayout>` 标签来使用组件

```js
import { createApp } from 'vue';
import { formPageLayoutPlugin } from '@formlogic/render-vue';

// 全局方式
const app = createApp();
app.use(formPageLayoutPlugin);

// <script setup>

<script setup>
import { FormPageLayout } from '@formlogic/render-vue';
</script>

<template>
  <FormPageLayout />
</template>

// JSX/TSX

import { FormPageLayout } from '@formlogic/render-vue';

export default {
  render() {
    return <FormPageLayout />;
  },
};

```

## 用法

### 基础用法

```vue
<template>
  <form-page-layout :get-logic-config="getLogicConfig" :meta-schema="metaSchema" />
</template>

<script setup>
import getLogicConfig from '@/low-code-meta/logic';

const action = '/xx/xx';

const metaSchema = {
  code: 'Model_C',
  name: '模型新增',
  model: 'Model',
  labelCol: 6,
  wrapperCol: 18,
  columnLayout: 3,
  group: [
    { code: 'basicInfo', name: '基础信息' },
    { code: 'metaInfo', name: '字段信息' },
  ],
  defaultSearchColumn: '6',
  data: [
    {
      code: 'code',
      name: '编码',
      type: 'column',
      schemaType: 'string',
      required: '1',
      group: 'basicInfo',
      logics: [],
    },
    {
      code: 'name',
      name: '名称',
      type: 'column',
      schemaType: 'string',
      required: '1',
      group: 'basicInfo',
      logics: [],
    },
    {
      code: 'type',
      name: '保存',
      type: 'button',
      schemaType: 'string',
      required: '1',
      logics: [{ logicCode: 'com_save', effectHook: 'onClick' }],
    },
  ],
};
</script>
```

## API

默认值为空属于必填属性

### Props

| 属性                  | 描述                                                   | 类型                                                  | 默认值 |
| --------------------- | ------------------------------------------------------ | ----------------------------------------------------- | ------ |
| getLogicConfig        | 获取逻辑编码                                           | (code: string) => Promise\<any\>                      |        |
| metaSchema            | 页面字段配置描述                                       | MetaSchema                                            | -      |
| pageCode              | 获取`low-code-meta/model-page`下的 json 文件           | string                                                | -      |
| language              | 表单验证国际化                                         | string                                                | zh-CN  |
| reloadFlag            | 值变化触发列表查询                                     | number                                                | -      |
| hasCacheWhere         | 是否缓存查询条件                                       | boolean                                               | true   |
| cacheKey              | 缓存的 Key 默认是 meta-schema 对象中的 code            | string                                                | -      |
| extraSearchParams     | 额外查询参数                                           | Record<string, any>                                   | {}     |
| transformSearchParams | 转换查询参数                                           | (params: object) => object                            | -      |
| components            | 注册组件                                               | Record<string, Component>                             | {}     |
| formConfig            | 查询表单配置                                           | IFormProps                                            | -      |
| loading               | 页面加载                                               | boolean                                               | false  |
| events                | 按钮点击事件勾子映射`MetaSchema`里 `eventCode`与之对应 | Record<string, (e: MouseEvent, ...args: any) => void> | {}     |
| extraLogicParams      | 逻辑流程额外参数                                       | Record<string, any>                                   | -      |
| hasFooter             | 是否需要底部按钮                                       | boolean                          | true   |
| hasBackBtn            | 是否需要返回按钮                                       | boolean                                  | true   |
| hasButton             | 是否需要按钮                                           | boolean                               | true   |
| hasGroup              | 是否需要分组                                           | boolean                                   | -      |

### Events

| 事件      | 描述               | 类型                |
| --------- | ------------------ | ------------------- |
| formMount | 监听表单已挂载     | (form:Form)=>void   |
| backClick | 监听搜索表单已挂载 | (form:Form) => void |

### 类型定义

组件导出以下类型定义：

```ts
import type { FormPageLayoutProps } from '@formlogic/render-vue';

import { getFormPageLayoutProps } from '@formlogic/render-vue';
```

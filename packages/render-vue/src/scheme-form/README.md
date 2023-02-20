# SchemeForm

### 介绍

表单配置

### 引入

通过以下方式来注册组件。 注册完成后，在模板中通过 `<scheme-form>` 或 `<SchemeForm>` 标签来使用组件

```js
import { createApp } from 'vue';
import { schemeFormPlugin } from '@formlogic/render-vue';

// 全局方式
const app = createApp();
app.use(schemeFormPlugin);

// <script setup>

<script setup>
import { SchemeForm } from '@formlogic/render-vue';
</script>

<template>
  <SchemeForm />
</template>

// JSX/TSX

import { SchemeForm } from '@formlogic/render-vue';

export default {
  render() {
    return <SchemeForm />;
  },
};

```

## 用法

### 基础用法

```vue
<template>
  <scheme-form :schema="schema" :form="form" />
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
  code: 'Model_C',
  name: '模型新增',
  model: 'Model',
  labelCol: 6,
  wrapperCol: 18,
  columnLayout: 3,
  group: [{ code: 'basicInfo', name: '基础信息' }],
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
const formSchemaRef = useFormSchema(ref({ metaSchema, hasGroup: true }));
const { schema } = formSchemaRef.value;
</script>
```

## API

默认值为空属于必填属性

### Props

| 属性             | 描述                                                   | 类型                                                  | 默认值 |
|----------------| ------------------------------------------------------ | ----------------------------------------------------- | ------ |
| form           | Form 实例                                              | Form                                                  |        |
| schema         | schema 协议                                            | ISchema                                               |        |
| language       | 表单验证国际化                                         | string                                                | zh-CN  |
| pattern        | 交互方式                                               | SchemaPattern                                         | -      |
| components     | 注册组件                                               | Record<string, Component>                             | {}     |
| loading        | 页面加载                                               | boolean                                               | false  |
| events         | 按钮点击事件勾子映射`MetaSchema`里 `eventCode`与之对应 | Record<string, (e: MouseEvent, ...args: any) => void> | {}     |
| getLogicConfig | 获取逻辑编码                                           | (code: string) => Promise\<any\>                      | -      |

### 类型定义

组件导出以下类型定义：

```ts
import type { SchemeFormProps } from '@formlogic/render-vue';

import { getSchemeFormProps } from '@formlogic/render-vue';

type SchemaPattern = "EDITABLE" | "DETAIL" | "DISABLED"

```

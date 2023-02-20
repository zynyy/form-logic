# ModalPageForm

### 介绍

对话框表单页面

### 引入

通过以下方式来注册组件。 注册完成后，在模板中通过 `<modal-page-formt>` 或 `<ModalPageForm>` 标签来使用组件

```js
// 全局方式
import { createApp } from 'vue';
import { modalPageFormPlugin } from '@formlogic/render-vue';

const app = createApp();
app.use(modalPageFormPlugin);

// <script setup>

<script setup>
import { ModalPageForm } from '@formlogic/render-vue';
</script>

<template>
  <ModalPageForm />
</template>

// JSX/TSX

import { ModalPageForm } from '@formlogic/render-vue';

export default {
  render() {
    return <ModalPageForm />;
  },
};

```

## 用法

### 基础用法

```vue
<template>
  <modal-page-form :visible="visible" :get-logic-config="getLogicConfig" :options="options" />
</template>

<script setup>
import getLogicConfig from '@/low-code-meta/logic';

import { ref } from 'vue';

import { TransformsSchemaOptions } from '@formily/render-vue';

const action = '/xx/xx';

const visible = ref(false);

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

const options =
  ref <
  TransformsSchemaOptions >
  {
    metaSchema,
  };
</script>
```

## API

默认值为空属于必填属性

### Props

| 属性               | 描述                                    | 类型                                                  | 默认值 |
| ------------------ |---------------------------------------| ----------------------------------------------------- | ------ |
| options            | 页面配置选项                                | TransformsSchemaOptions                               |        |
| getLogicConfig     | 获取逻辑编码                                | (code: string) => Promise\<any\>                      |        |
| visible            | 抽屉是否可见                                | MetaSchema                                            | -      |
| extraLogicParams   | 逻辑流程额外参数                              | string                                                | -      |
| validateFormValues | 表单验证                                  | string                                                | zh-CN  |
| language           | 表单验证国际化语言                             | string                                                | zh-CN  |
| width              | 对话框宽度                                 | number                                                | -      |
| title              | 对话框标题                                  | string                                                | true   |
| hasConfirmButton   | 是否需要默认的确定按钮                           | string                                                | -      |
| components         | 注册组件                                  | Record<string, Component>                             | {}     |
| formConfig         | 表单配置                                  | IFormProps                                            | -      |
| events             | 按钮点击事件勾子映射`MetaSchema`里 `eventCode`与之对应 | Record<string, (e: MouseEvent, ...args: any) => void> | {}     |

### Events

| 事件      | 描述             | 类型                   |
| --------- | ---------------- | ---------------------- |
| formMount | 监听表单已挂载   | (form:Form)=>void      |
| close     | 抽屉点击关闭按钮 | (form:Form) => void    |
| confirm   | 点击确定触发     | (formValues:any)=>void |

### Slots

| Name  | Description | SlotProps |
| ----- |-------------| --------- |
| title | 自定义对话框标题内容  |           |

### 类型定义

组件导出以下类型定义：

```ts
import type { ModalPageFormProps } from '@formlogic/render-vue';

import { getModalPageFormProps } from '@formlogic/render-vue';
```

# DrawerPageForm

### 介绍

抽屉表单页面

### 引入

通过以下方式来注册组件。 注册完成后，在模板中通过 `<drawer-page-formt>` 或 `<DrawerPageForm>` 标签来使用组件

```js
// 全局方式
import { createApp } from 'vue';
import { drawerPageFormPlugin } from '@formlogic/render-vue';

const app = createApp();
app.use(drawerPageFormPlugin);

// <script setup>

<script setup>
import { DrawerPageForm } from '@formlogic/render-vue';
</script>

<template>
  <DrawerPageForm />
</template>

// JSX/TSX

import { DrawerPageForm } from '@formlogic/render-vue';

export default {
  render() {
    return <DrawerPageForm />;
  },
};

```

## 用法

### 基础用法

```vue
<template>
  <drawer-page-form :visible="visible" :get-logic-config="getLogicConfig" :options="options" />
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

| 属性               | 描述                                                   | 类型                                                  | 默认值 |
| ------------------ | ------------------------------------------------------ | ----------------------------------------------------- | ------ |
| options            | 页面配置选项                                           | TransformsSchemaOptions                               |        |
| getLogicConfig     | 获取逻辑编码                                           | (code: string) => Promise\<any\>                      |        |
| visible            | 抽屉是否可见                                           | boolean                                               | -      |
| extraLogicParams   | 逻辑流程额外参数                                       | Record<string, any>                                   | -      |
| validateFormValues | 表单验证                                               | (formValues: any) => Promise\<string\>                | -      |
| language           | 表单验证国际化语言                                     | string                                                | zh-CN  |
| width              | 抽屉宽度                                               | number ｜ string                                      | 90%    |
| title              | 抽屉标题                                               | string ｜ slots                                       | 请填写 |
| hasConfirmButton   | 是否需要默认的确定按钮                                 | boolean                                               | true   |
| components         | 注册组件                                               | Record<string, Component>                             | {}     |
| formConfig         | 表单配置                                               | IFormProps                                            | -      |
| events             | 按钮点击事件勾子映射`MetaSchema`里 `eventCode`与之对应 | Record<string, (e: MouseEvent, ...args: any) => void> | {}     |

### Events

| 事件      | 描述             | 类型                   |
| --------- | ---------------- | ---------------------- |
| formMount | 监听表单已挂载   | (form:Form)=>void      |
| close     | 抽屉点击关闭按钮 | (form:Form) => void    |
| confirm   | 点击确定触发     | (formValues:any)=>void |

### Slots

| Name  | Description | SlotProps |
| ----- | ----------- | --------- |
| title | 自定义抽屉标题内容  |           |

### 类型定义

组件导出以下类型定义：

```ts
import type { DrawerPageFormProps } from '@formlogic/render-vue';

import { getDrawerPageFormProps } from '@formlogic/render-vue';
```

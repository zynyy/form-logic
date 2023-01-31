# @formLogic/render

渲染层

## Install 安装

```pnpm
pnpm add @formlogic/render
```

```yarn
yarn add @formlogic/render
```

```npm
npm install @formlogic/render
```

## Usage 使用

### SchemeForm

用于解析 Json Schema 动态渲染表单的组件

```tsx
import { SchemeForm, useCreateForm } from '@formlogic/render';

const Demo = () => {
  const [form] = useCreateForm({});

  return <SchemeForm form={form} schema={{}} />;
};
```

### FormPageLayout

用于渲染普通表单的组件

```tsx
import { FormPageLayout } from '@formlogic/render';

const Demo = () => {
  return <FormPageLayout metaSchema={{}} />;
};
```

### ListLayout

用于渲染普通列表的组件

```tsx
import { ListLayout } from '@formlogic/render';

const Demo = () => {
  return <ListLayout action="" metaSchema={{}} />;
};
```

### ModalPageForm

用于渲染模态对话框普通表单的组件

```tsx
import { ModalPageForm } from '@formlogic/render';

const Demo = () => {
  return <ModalPageForm open options={{}} />;
};
```

### DrawerPageForm

用于渲染抽屉普通表单的组件

```tsx
import { DrawerPageForm } from '@formlogic/render';

const Demo = () => {
  return <DrawerPageForm open options={{}} />;
};
```

### ListCheckLayout

选择列表数据

```tsx
import { ListCheckLayout } from '@formlogic/render';

const Demo = () => {
  return <ListCheckLayout metaSchema={{}} action="" />;
};
```

### ArrayTableBase

渲染表格组件

```tsx
import { ArrayTableBase } from '@formlogic/render';

const Demo = () => {
  return <ArrayTableBase />;
};
```

### hooks

1. `useOpen` 管理抽屉对话框 `open` 状态的 Hook

```tsx
import { useOpen } from '@formlogic/render';

const [open, openModal, closeModal] = useOpen();
```

1. `useTransformsOptions` 页面配置转换成 `formily` 协议格式

```tsx
import { useTransformsOptions } from '@formlogic/render';
const [options] = useTransformsOptions({
  pageCode: 'xxx',
  metaSchema: {},
  hasGroup: true,
  pattern: 'EDITABLE',
});
```

1. `useFormSchema` 由`metaSchema`转换成渲染普通表单所需要的数据

```tsx
import { usePageForm } from '@formlogic/render';

const { schema, buttons, form, formLoading } = usePageForm({
  formConfig: {},
  onFormMount: () => void 0,
  autoRefreshForm: true,
  options: {},
  getLogicConfig: () => Por,
  logicParams: {},
  events: {},
});
```

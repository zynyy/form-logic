# @formLogic/render-vue

渲染层

## Install 安装

```pnpm
pnpm add @formlogic/render-vue
```

```yarn
yarn add @formlogic/render-vue
```

```npm
npm install @formlogic/render-vue
```

## Usage 使用

### SchemeForm

用于解析 Json Schema 动态渲染表单的组件

```vue
<script>
import { SchemeForm } from '@formlogic/render-vue';
</script>

<template>
  <scheme-form :schema="schema" :form="form" />
</template>
```

### FormPageLayout

用于渲染普通表单的组件

```vue
<script>
import { FormPageLayout } from '@formlogic/render-vue';
</script>

<template>
  <form-page-layout :get-logic-config="getLogicConfig" :meta-schema="metaSchema" />
</template>
```

### ListLayout

用于渲染普通列表的组件

```vue
import { ListLayout } from '@formlogic/render-vue';

<template>
  <list-layout :get-logic-config="getLogicConfig" :action="action" :meta-schema="metaSchema" />
</template>
```

### ModalPageForm

用于渲染模态对话框普通表单的组件

```vue
<template>
  <modal-page-form :visible="visible" :get-logic-config="getLogicConfig" :options="options" />
</template>
```

### DrawerPageForm

用于渲染抽屉普通表单的组件

```vue
<template>
  <drawer-page-form :visible="visible" :get-logic-config="getLogicConfig" :options="options" />
</template>
```

### ListCheckLayout

选择列表数据

```vue
<script>
import { ListCheckLayout } from '@formlogic/render-vue';
</script>

<template>
  <list-check-layout
    :get-logic-config="getLogicConfig"
    :action="action"
    :meta-schema="metaSchema"
  />
</template>
```

`useTransformsOptions` 页面配置转换成 `formily` 协议格式

```vue
<script>
import { useTransformsOptions } from '@formlogic/render-vue';
import { ref } from 'vue';
const { options } = useTransformsOptions({
  pageCode: ref(pageCode),
  metaSchema: ref(metaSchema),
  hasGroup: ref(hasGroup),
  pattern: ref(pattern),
});
</script>
```

`useCreateForm` 创建 form 实例

```vue
<script>
import { useCreateForm } from '@formlogic/render-vue';
import { ref } from 'vue';

const [form, refreshForm] = useCreateForm(
  ref({
    formConfig,
    onMount,
    autoRefreshForm,
  }),
);
</script>
```

`useFormSchema`: 转换成渲染表单所需要的数据

```vue
<script>
import { usePageForm } from '@formlogic/render-vue';
import { ref } from 'vue';

const { schema, buttons, form, formLoading } = usePageForm(
  ref({
    formConfig,
    onFormMount,
    options,
    getLogicConfig,
    logicParams,
    events,
    autoRefreshForm,
  }),
);
</script>
```

`useListPageForm`: 转换成渲染列表所需要的数据

```vue
<script>
import { useListPageForm } from '@formlogic/render-vue';
import { ref } from 'vue';

const { schema, buttons, form, formLoading } = useListPageForm(
  ref({
    options,
    events,
    getLogicConfig,
    onSearchMount,
    onTableMount,
    logicParams,
  }),
);
</script>
```

`useTriggerLogic` 执行逻辑流程

```vue
<script>
import { useTriggerLogic } from '@formlogic/render-vue';
const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {});
</script>
```

`useBindLogic` 绑定页面字段流程

```vue
<script>
import { useBindLogic } from '@formlogic/render-vue';
const doneFormId = useBindLogic(
  ref(form),
  ref({
    logicList,
    getLogicConfig,
    logicParams,
    cb,
    autoLogic,
  }),
);
</script>
```

`useBindBtnClick` 绑定页面按钮点击流程

```vue
<script>
import { useBindBtnClick } from '@formlogic/render-vue';
import { ref } from 'vue';

const doneFormId = useBindBtnClick(
  ref({
    form,
    btnList,
    getLogicConfig,
    logicParams,
    events,
    cb,
    autoLogic,
  }),
);
</script>
```

`useDynamicSchema` 动态转换 Schema

```vue
<script>
import { useDynamicSchema } from '@formlogic/render-vue';
import { ref } from 'vue';

const { schemaRef, doneRef } = useDynamicSchema(ref(metaSchema));
</script>
```

`useJsonMetaSchema` 根据pageCode获取`low-code-meta/model-page`下的 json 文件

```vue
<script>
import { useJsonMetaSchema } from '@formlogic/render-vue';

const { metaSchema, loading } = useJsonMetaSchema(ref(pageCode));
</script>
```

`useSchemaComponentsContext` 获取顶层注册的 components

```vue
<script>
import { useSchemaComponentsContext } from '@formlogic/render-vue';

const componentsRef = useSchemaComponentsContext();
</script>
```

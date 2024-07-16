# @cndinfo/code-render

渲染层

## Install 安装

```pnpm
pnpm add @cndinfo/code-render
```

```yarn
yarn add @cndinfo/code-render
```

```npm
npm install @cndinfo/code-render
```

## Usage 使用

### SchemeForm

用于解析 Json Schema 动态渲染表单的组件

```vue
<script>
import { SchemeForm } from '@cndinfo/@cndinfo/code-render';
export default {
  components: {
    SchemeForm,
  },
};
</script>

<template>
  <scheme-form :schema="schema" :form="form" />
</template>
```

### FormPageLayout

用于渲染普通表单的组件

```vue
<script>
import { FormPageLayout } from '@cndinfo/@cndinfo/code-render';
export default {
  FormPageLayout,
  data() {
    return {
      metaSchema: {},
    };
  },
  methods: {
    getLogicConfig() {},
  },
};
</script>

<template>
  <form-page-layout :get-logic-config="getLogicConfig" :meta-schema="metaSchema" />
</template>
```

### ListLayout

用于渲染普通列表的组件

```vue
import { ListLayout } from '@cndinfo/@cndinfo/code-render';

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

`useTransformsOptions` 页面配置转换成 `formily` 协议格式

```vue
<script>
import { useTransformsOptions } from '@cndinfo/@cndinfo/code-render';
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
import { useCreateForm } from '@cndinfo/@cndinfo/code-render';
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
import { usePageForm } from '@cndinfo/@cndinfo/code-render';
import { ref } from 'vue';

const { schema, buttons, form, formLoading } = usePageForm(
  ref({
    formConfig,
    onFormMount,
    options,
    getLogicConfig,
    logicParams,
    autoRefreshForm,
  }),
);
</script>
```

`useListPageForm`: 转换成渲染列表所需要的数据

```vue
<script>
import { useListPageForm } from '@cndinfo/@cndinfo/code-render';
import { ref } from 'vue';

const { schema, buttons, form, formLoading } = useListPageForm(
  ref({
    options,
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
import { useTriggerLogic } from '@cndinfo/@cndinfo/code-render';
const [triggerLogic] = useTriggerLogic(getLogicConfig, () => {});
</script>
```

`useBindLogic` 绑定页面字段流程

```vue
<script>
import { useBindLogic } from '@cndinfo/@cndinfo/code-render';
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
import { useBindBtnClick } from '@cndinfo/@cndinfo/code-render';
import { ref } from 'vue';

const doneFormId = useBindBtnClick(
  ref({
    form,
    btnList,
    getLogicConfig,
    logicParams,
    cb,
    autoLogic,
  }),
);
</script>
```

`useDynamicSchema` 动态转换 Schema

```vue
<script>
import { useDynamicSchema } from '@cndinfo/@cndinfo/code-render';
import { ref } from 'vue';

const { schemaRef, doneRef } = useDynamicSchema(ref(metaSchema));
</script>
```

`useJsonMetaSchema` 根据 pageCode 获取`low-code-meta/model-page`下的 json 文件

```vue
<script>
import { useJsonMetaSchema } from '@cndinfo/@cndinfo/code-render';

const { metaSchema, loading } = useJsonMetaSchema(ref(pageCode));
</script>
```

`useSchemaComponentsContext` 获取顶层注册的 components

```vue
<script>
import { useSchemaComponentsContext } from '@cndinfo/@cndinfo/code-render';

const componentsRef = useSchemaComponentsContext();
</script>
```

# 使用说明

## 环境要求

1. 包管理器 pnpm
2. node 版本 16 以上

## 安装

1. pnpm i 安装依赖
2. 进入 render-vue2 目录
3. 执行 pnpm run storybook 命令

## package script 命令说明

1. `storybook` 组件的开发环境
2. `build` 打包源码发包


## 目录说明

```js
// 目录结构
// render-vue2
// ├── src // 源码目录
//     ├── common-logic // 公共逻辑比如页面的增删改查
//          ├── com_confirm // 弹窗确认逻辑
//          ├── com_delete // 删除逻辑
//          ├── com_emptyDisabled // 空值禁止
//          ├── com_firstNotVisible // Array模型的首行数据不可见
//          ├── com_idDisabled // 表单中含有id有值禁止输入
//          ├── com_idRequired // 表单中含有id有值则必填
//          ├── com_idVisible // 表单中含有id有值则可见
//          ├── com_openDialog // 打开一个模态框组件 也就是 modal-page-form 这个组件
//          ├── com_openDrawer // 打开一个抽屉组件 也就是 drawer-page-form 这个组件
//          ├── com_openEditDialog // 打开一个抽屉组件 也就是 drawer-page-form 这个组件
//          ├── com_openEditDrawer // 打开一个抽屉组件 也就是 drawer-page-form 这个组件
//          ├── com_pushLink // 页面跳转
//          ├── com_save // 页面保存
//          ├── com_targetExpressionDisabled // 使用表达式判断是否禁止
//          ├── com_targetExpressionRequired // 使用表达式判断是否必填
//          ├── com_targetExpressionVisible // 使用表达式判断是否可见
//          ├── com_targetFieldsMap // 下拉赋值给其他字段值
//     ├── components // 组件目录
//          ├── ag-grid // 针对 ag-grid 表格进行的二次封装适配低代码
//          ├── array-base // 针对 Array 模型的 增删改查等按钮封装
//          ├── array-card // 适用于 Array 模型的组件 卡片
//          ├── array-items // 适用于 Array 模型的组件 自增列表
//          ├── buttons // 按钮类的组件
//          ├── cascader // 联级选择器
//          ├── checkbox // 复选框
//          ├── custom-button // 封装的按钮组件
//          ├── date-picker // 日期选择器
//          ├── draggable-modal // 模态框
//          ├── drawer-modal-button // 渲染抽屉与模态框的按钮
//          ├── dropdown // 下拉菜单
//          ├── dynamic-schema // 区域内动态 schema
//          ├── feedback-badge // 出现在按钮、图标旁的数字或状态标记。
//          ├── file-upload // 文件上传组件
//          ├── form-grid // 栅格布局
//          ├── form-group // 分组卡片
//          ├── form-item // 表单项
//          ├── form-layout // 表单布局
//          ├── form-tabs-group // 标签页布局
//          ├── icon-font // icon
//          ├── input // 文本框
//          ├── input-number // 数字框
//          ├── layout // 页面布局
//          ├── page-loading // 页面加载中状态。
//          ├── password // 密码框
//          ├── radio // 单选框
//          ├── schema-fragment // 空节点
//          ├── select // 下拉框
//          ├── slider // 滑动输入条
//          ├── space // 组件之间的间距
//          ├── space-button // 按钮类之间的间距
//          ├── space-compact // 紧凑模式
//          ├── spin // 加载中状态。
//          ├── switch // 开关。
//          ├── tree // 树型。
//          ├── tree-list // 树型列。
//          ├── where-layout // 查询条件组件。
//     ├── config // 配置文件
//     ├── effect-hook // 定义字段、表单、自定义触发器的勾子文件
//     ├── exec-logic // 执行勾子逻辑
//     ├── hooks // 公共逻辑勾子函数
//          ├── card // 提取卡片类json schema的钩子
//          ├── devtool // 与浏览器通信的钩子废弃类浏览器插件没开发完成
//          ├── dialog // 处理模态框类钩子
//          ├── dom // dom相关钩子
//          ├── drawer // 处理抽屉类钩子
//          ├── notify // 表单通信钩子
//          ├── renderer-schema // 核心钩子。改目录下的钩子是处理对应的模板组件所需要的 schema
//          ├── request // 请求接口钩子
//          ├── table // 处理表格类的json schema
//          ├── tabs // 处理标签页的json schema
//          ├── useCacheWhere // 本地查询缓存
//          ├── useChildrenForceUpdate // 强制刷新子元素
//          ├── useJsonMetaSchema //  根据 pageCode 获取 json schema
//          ├── useLogic // 核心钩子 注入逻辑相关的钩子
//          ├── useOpen // 开关钩子
//          ├── useReloadFlag // 递增钩子
//          ├── usePropertiesSources // 获取子元素信息
//          ├── useSchemaField // 核心钩子 注入组件并且创建渲染  json schema 的组件
//     ├── renderer-layout // 页面模板文件
//          ├── drawer-list-check-layout // 抽屉类列表勾选布局
//          ├── drawer-page-form // 抽屉类表单页渲染器
//          ├── form-page-layout // 表单页渲染器
//          ├── list-check-layout // 列表勾选渲染器
//          ├── list-layout // 列表渲染器
//          ├── modal-list-check-layout // 模态框类列表勾选布局
//          ├── modal-page-form // 模态框表单页渲染器
//          ├── page-code-render // 根据 PageCode 获取远程JSON Schema信息渲染页面模板
//          ├── scheme-buttons-form // 渲染按钮组件
//          ├── scheme-form // 渲染表单schema的核心组件
//          ├── scheme-table-form // 渲染表格tabel schema的核心文件
//          ├── table-page-code-render // 左边表格右边根据左边选择的数据渲染不同的页面
//          ├── tree-list-layout // 树型列表组件 左边树右边列表
//          ├── tree-page-code-render // 左边树 右边根据左边选择的数据渲染不同的页面
//     ├── low-code-meta // 通过页面配置然后通过请求 cndinfo-server 生成文件主要是 json schema 和 页面逻辑
//     ├── service // api 请求
//     ├── transforms // 转化器转成 formily 所需要的 schema
//     ├── utils // 工具函数
//
// └── test // jest测试配置文件
```

## schema 说明

```ts
interface MetaSchema {
  code: string; // 页面编码
  model: string; // 页面名称
  columnLayout?: number; // 页面几布局
  defaultSearchColumn?: number; // 展示搜索数量多余的将隐藏点击更多看的更全
  labelCol?: number | undefined;
  wrapperCol?: number | undefined;
  remark?: string; // 备注
  group?: MetaSchemaGroup[]; // 页面分组信息
  data: MetaSchemaData[]; // 页面元信息数据集
}

interface MetaSchemaGroup {
  code: string; // 分组编码
  name: string; // 分组名称
  hiddenName?: boolean; // 是否隐藏名称
  component?: string; // 组件
  mode?: 'tabs' | 'setpes'; // 分组模式
  modeCodes?: string[]; // 分组集合编码
  componentProps?: {
    [key: string]: any;
  }; // 组件属性
}

enum MetaDataTypeEnum {
  column = 'column', // 字段
  table_column = 'table_column', // 列表字段
  search_column = 'search_column', // 搜索字段
  button = 'button', // 按钮
  table_button = 'table_button', // 表格按钮
  search_button = 'search_button', // 搜索按钮
  container = 'container', // 容器
}

interface MetaSchemaData {
  code: string; // 字段
  name: string; // 字段名称
  type: MetaDataType; // 字段类型
  schemaType: SchemaTypes; // 字段值类型
  group?: string; // 所属分组
  hiddenName?: StrNumBool; // 是否隐藏名称 1 是 0 否
  disabled?: StrNumBool; // 是否禁止
  required?: StrNumBool; // 是否必填
  wrap?: StrNumBool; // 是否换行
  hidden?: StrNumBool; // 是否隐藏字段
  hasSerialNo?: StrNumBool; // 表格属性是否需要显示序号
  hasSort?: StrNumBool; // 表格属性是否需要拖动排序
  description?: string; // 字段补充描述
  colSpan?: number; // 表单项属性跨列
  labelCol?: number; // 表单项属性名称占比宽度
  wrapperCol?: number; // 表单项属性组件占比宽度
  defaultValue?: any; // 默认值
  component?: string; // 组件
  parentCode?: string; // 上一级编码
  logics?: MetaLogic[]; // 页面逻辑
  componentProps?: {
    [key: string]: any;
  }; // 组件属性
  validator?: ValidateRules[]; // 字段校验
  pageCode?: string; // 页面编码使用场景是当 schemaType 是 object 或者 array 时如果无法配置出来进行拆分配置。
  itemMetaSchema?: MetaSchema; // 使用场景是当 schemaType 是 object 或者 array 他们子项的数据集合
}
```

## formily schema 说明

```ts
interface FormilySchema {
  name?: SchemaKey; // 字段
  title?: Message; // 字段的名称 label
  default?: any; // 默认值
  type?: SchemaTypes; // 核心
  required?: string[] | boolean | string;
  是否必填;
  properties?: {
    [xx]: FormilySchema;
  }; // 子属性
  items?: FormilySchema; // array 额外的属性
  ['x-index']?: number; // 索引
  ['x-pattern']?: Pattern; // 模式
  ['x-display']?: Display; // 是否显示
  ['x-validator']?: Validator; // 验证器
  ['x-decorator']?: Decorator | (string & {}) | ((...args: any[]) => any);
  ['x-decorator-props']?: DecoratorProps;
  ['x-component']?: Component | (string & {}) | ((...args: any[]) => any);
  ['x-component-props']?: ComponentProps;
  ['x-content']?: any; // 上下文存储 slots 之类的
  ['x-data']?: any; // 自定义内容
  ['x-visible']?: boolean; // 是否可见
  ['x-hidden']?: boolean; // 是否隐藏
  ['x-disabled']?: boolean; // 是否禁止
  ['x-editable']?: boolean; // 是否编辑
  ['x-read-only']?: boolean; // 只读
  ['x-read-pretty']?: boolean; // 阅读
}
```

## 启动错误

1. getChildren: JSXFragment is not support 或者是 TS1381: Unexpected token. Did you mean `{'}'}` or `&rbrace;` 皆是因为 代码里写 <> </>
   解决方案是 `<> </>` 替换成 `<Fragment> </Fragment>` 该组件引入路径必须是 formily-vue 下的

## 控制台警告

1. `"xx" is a reserved attribute and cannot be used as component prop`. 这个说明 xx 属性是保留属性不应该在 props 中定义
   解决方法: 把定义的 `props` 里面有 `xx` 的删除掉即可

2. Invalid prop: type check failed for prop "xx". Expected aType, got bType。这个说明 xx 属性的类型定义与实际不符合期望是 aType 类型结果是 bType 类型
   解决方法: 在定义 `props` 里修改 `xx` 定义类型或者修改调用组件的值

3. Missing required prop："xx" 这个说明 xx 属性是必须的调用的组件没设置 xx 属性
   解决方法: 在调用组件增加 xx 属性 或者 在定义 `props` 里修改 `xx` 的 required 为 false

4. Invalid handler for event "xx": got xx 这个说明 props 里定义了 onXx 事件
   解决方法: 删除 props 里定义的 onXx 事件。如果组件里使用调用里 props.onXx 改成 listeners.xx 或者`const {onXx} = formatComponentProps({ on: listeners })`
5. Multiple root nodes returned from render function. Render function should return a single root node. 这个说明组件返回了多个节点
   解决方法：在组件里最外层使用 `<Fragment> </Fragment>`包一下

## vue jsx 用法

注意如果 props 是 onxxx 的属性并且不是事件的需要通过 `<div {...attrs: {onxxx: ''}}/>` 来写避免被解析成事件

1. 插槽 slot 的用法在组件属性上定义`scopedSlots`

```js
import { defineComponent } from 'vue';

const Input = defineComponent({
  name: 'Input',
  setup(props: InputProps, { attrs, slots, listeners }) {
    return () => {
      return (
        <div
          {...{
            scopedSlots: {
              header: () => {
                return <div />;
              },
            },
          }}
        />
      );
    };
  },
});

export default Input;
```

1. 如果属性是 on 开头的并且不是事件

```js
import { defineComponent } from 'vue';

const Input = defineComponent({
  name: 'Input',
  setup(props: InputProps, { attrs, slots, listeners }) {
    return () => {
      return (
        <div
          {...{
            attrs: {
              onxx: true,
            },
          }}
        />
      );
    };
  },
});
```

## storybook 说明

Storybook 是 UI 组件的开发环境，它允许开发者浏览组件库，查看每个组件的不同状态，以及交互地开发和测试组件。

文件名称 `[compoentName].stories.tsx` 文件内容大致是

```js
export default {
  title: 'ListCheckLayout', // 标题
  component: ListCheckLayout,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const render = ({ metaSchema, ...args }) => ({
  components: { ListCheckLayout },
  setup() {
    return () => {
      return <ListCheckLayout metaSchema={metaSchema} {...args} />;
    };
  },
});

export const list = {
  render,
  args: {
    metaSchema: Logic_L,
  },
};
```

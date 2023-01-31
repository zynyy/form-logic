# @formLogic/editor

基于 `@antv/x6` 封装的绘制流程编辑器

```pnpm
pnpm add @formlogic/editor
```

```yarn
yarn add @formlogic/editor
```

```npm
npm install @formlogic/editor
```

## Usage

### FlowChartEditor

绘制流程图

```js
import { FlowChartEditor } from '@formlogic/editor';

const Demo = () => {
  return <FlowChartEditor />;
};
```

### LogicEffectHookProcess

模型字段绑定流程逻辑关系图

```js
import { LogicEffectHookProcess } from '@formlogic/editor';

const Demo = () => {
  return (
    <LogicEffectHookProcess
      effectHookSource={[]}
      logics={[]}
      pageDataSource={[]}
      pageCode=""
      modelCode=""
    />
  );
};
```

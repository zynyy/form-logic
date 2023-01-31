# @formLogic/component

基于`antd`以及其他一些库进行的二次封装组件库

```pnpm
pnpm add @formlogic/component
```

```yarn
yarn add @formlogic/component
```

```npm
npm install @formlogic/component
```

## Usage

### DiffMonacoEditor

比较 2 份代码差异性

```js
import { DiffMonacoEditor } from '@formlogic/component';

const Demo = () => {
  return <DiffMonacoEditor original="" modified="" />;
};
```

### MonacoEditor

代码编辑器

```js
import { MonacoEditor } from '@formlogic/component';

const Demo = () => {
  return <MonacoEditor />;
};
```

### DraggableModal

可拖动的模态对话框

```tsx
import { DraggableModal } from '@formlogic/component';

const Demo = () => {
  return <DraggableModal open />;
};
```

### infoModal

可拖动的模态信息对话框

```tsx
import { infoModal } from '@formlogic/component';

infoModal({})
```

### confirmModal

可拖动的模态确认对话框

```tsx
import { confirmModal } from '@formlogic/component';

confirmModal({})
```

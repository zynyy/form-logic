
# formlogic-tpl

formlogic-tpl 是一个基于 Plop 实现的快速创建模板文件工具。


### 安装

```shell
# 通过 npm
npm i @formlogic/tpl -D

# 通过 yarn
yarn add @formlogic/tpl -D

# 通过 pnpm
pnpm add @formlogic/tpl -D

# 通过 Bun
bun add @formlogic/tpl -D
```

安装完成后，请将以下配置命令按需添加到 package.json 文件中

```json
{
  "scripts": {
    "init-plop": "formlogic-tpl init-plop",
    "plop": "formlogic-tpl plop",
    "plop:vue3Tsx": "formlogic-tpl -g component-vue3-tsx"
  }
}
```

```

## 目录说明

```js
// 目录结构
// tpl
// ├── src // 源码目录
//     ├── plop // plop 封装
//     ├── utils // 工具函数
// ├── bin.js // node 执行文件
```

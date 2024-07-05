
# package-compiler

package-compiler 是一个基于 Vite 实现的 Vue 组件库构建工具。


### 安装

```shell
# 通过 npm
npm i @formlogic/package-compiler -D

# 通过 yarn
yarn add @formlogic/package-compiler -D

# 通过 pnpm
pnpm add @formlogic/package-compiler -D

# 通过 Bun
bun add @formlogic/package-compiler -D
```

安装完成后，请将以下配置命令按需添加到 package.json 文件中

```json
{
  "scripts": {
    "build:vue2": "package-compiler build-vue2",
    "build:vue2Ts": "package-compiler build-vue2-ts",
    "build:vue3Ts": "package-compiler build-vue3-ts",
    "build:vue3": "package-compiler build-vue3"
  }
}
```

创建文件 `formlogic.config.mjs` 写入以下内容

```js


export default {
  name: 'xxx', //包名
  build: {
    css: {
      removeSourceFile: false, // 是否删除原.less .scss 文件
    },
  },
};

```

## 目录说明

```js
// 目录结构
// package-compiler
// ├── src // 源码目录
//     ├── commands // 各种命令入口
//     ├── compiler // 对不同文件进行编译的工具
//     ├── utils // 工具函数
// ├── bin.js // node 执行文件
```

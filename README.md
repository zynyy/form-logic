# 项目说明

formlogic 是面向前端开发者的工具，核心解决的是页面、逻辑复用的问题。
让开发者只需开发业务所需要的组件和业务逻辑无需关心页面渲染以及路由文件。
简单的curd没啥业务逻辑页面大概只需半小时就可以与后端调试。
可以精准的控制页面上的每个字段、按钮显示和逻辑让每个角色权限控制更加简单直观

## 每个包说明

1. `@formlogic/component` 组件包
1. `@formlogic/render` 渲染层通过定义的 `meta schema` 解析渲染以及执行页面逻辑
1. `@formlogic/editor` 编辑器可视化逻辑编排
1. `@formlogic/server` 服务开发需要启动服务生成文件
1. `@formlogic/tpl` 微生成器生成各种预制的模板代码快速的完成页面所需要的文件
1. `@formlogic/devtools` 谷歌插件快速的修改页面配置以及查看

# pnpm 使用

官网: <https://pnpm.io/zh/motivation>

1. 执行命令 `pnpm run xx`
1. 安装所有依赖 `pnpm i`
1. 添加新依赖包 `pnpm add <pkg>`
1. 打包新版本 `pnpm run version:xx`
1. 发布新版本包 `pnpm run release`
1. 本地测试包
  1. `pnpm link`
  1. 到项目中 `pnpm link xx`
  1. 调试完删除 `pnpm unlink xx`

# lerna 使用
官网: <https://lerna.js.org/docs/api-reference/commands>

1. 创建新包 `lerna improt <pkg>`

# storybook

官网: <https://storybook.js.org/docs/react/get-started/introduction>

1. 初始化 ` pnpx storybook init --type react`
1. 按照 <https://storybook.js.org/docs/react/builders/webpack#typescript-module-resolution> 进行修改配置

## 主要目录结构说明

```js
// 目录结构
// low-code-logic
// ├── example // 使用案例
// ├── devtools // 谷歌插件
// ├── packages // 核心包
//       ├── component  // 组件包
//       ├── editor  // 逻辑编排编辑器
//       ├── render  // 页面布局渲染
//       ├── server  // 本地开发需要的服务用来生成和更改文件
//       └── tpl  // 微生成器快速生成增删改查逻辑以及布局
// └── scripts // 打包样式所需要的脚本
```

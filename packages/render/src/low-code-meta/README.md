# 目录说明

`low-code-meta` 目录是由 `@formlogic/server` 工具包自动生成的相关代码逻辑请勿删除改目录

```js
// 目录结构
// low-code-meta
// ├── field-meta 字段集合
// ├── logic 所有逻辑流程代码
//       ├── public  // 公共逻辑
//       ├── [model-code] // 模型下的逻辑
// ├── model 由 field-meta集合组成的模型所对应的后端表
//       └── [model-code]
// └── model-page 由 model 模型组成的每个页面配置
//       └── [model-code]
//               └── [page-code] // 命名规则 [model]_xx_C(创建)、U(更新)、D(详情)、L(列表)
```

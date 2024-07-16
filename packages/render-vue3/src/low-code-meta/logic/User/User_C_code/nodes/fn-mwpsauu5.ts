// 函数节点
export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  console.log(ctx.lastResult);

  return {};
}

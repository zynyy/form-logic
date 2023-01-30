// 函数节点

export default async function (ctx) {
  const { payload } = ctx || {};
  const { params } = payload || {};

  const { data } = ctx.lastResult || {};

  const { successCallback } = params || {};

  successCallback?.(data);

  return {
    nextEdge: "",
    ...ctx.lastResult
  };
}

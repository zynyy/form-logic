// 判读节点 必须要返回 nextEdge 值是 YES 或者 NO
export default async function (ctx) {
  const { success } = ctx.lastResult || {};

  if (success) {
    return {
      nextEdge: 'YES',
      ...ctx.lastResult,
    };
  }

  return {
    nextEdge: 'NO',
  };
}

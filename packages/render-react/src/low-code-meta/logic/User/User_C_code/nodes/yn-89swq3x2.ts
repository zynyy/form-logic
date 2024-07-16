// 判读节点 必须要返回 nextEdge 值是 YES 或者 NO
export default async function (ctx, next) {
  setTimeout(() => {
    next('No', {
      msg: '手动执行下一个节点',
    });
  }, 1000);

  return {
    noExecNextNode: true,
  };
}

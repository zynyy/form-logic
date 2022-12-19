export const yesOrNoTemplate = () => {
  return `
  // 判读节点 必须要返回 nextEdge 值是 YES 或者 NO
  export default async function (ctx) {

    if (!true) {
        return {
            nextEdge: "NO"
        }
    }

    return {
        nextEdge: "YES"
    }
  }`;
};

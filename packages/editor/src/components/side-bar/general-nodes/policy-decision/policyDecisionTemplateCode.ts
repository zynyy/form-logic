export const policyDecisionTemplateCode = () => {
  return `// 决策节点 必须要返回 nextEdg 值是自动下个节点边的值相等
export default async function (ctx) {

    return {
        nextEdge: "test"
    }
}`;
};

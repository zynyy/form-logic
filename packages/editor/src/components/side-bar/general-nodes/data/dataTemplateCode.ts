export const dataTemplateCode = () => {
  return `
  // 数据节点
export default async function (ctx) {
    const { payload } = ctx || {}
    const { form, field } = payload || {};

    form.query("xxx").take((target) => {
        target.setComponentProps({
            api: {
                method: "POST",
                url: "xx",
                params: {

                },
            },
        });
    });

    return {}
}
`;
};

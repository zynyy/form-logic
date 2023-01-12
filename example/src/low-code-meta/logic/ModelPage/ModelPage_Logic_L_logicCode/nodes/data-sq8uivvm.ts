// 数据节点
export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, field, params } = payload || {};

  const { model } = params || {};

  field.setComponentProps({
    apiConfig: {
      method: 'get',
      url: '/local-api/model-logic/list',
      params: {
        model,
        formId: form.id,
      },
    },
  });
  return {};
}

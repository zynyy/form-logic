// 数据节点
export default async function (ctx) {
  const { payload, execInfo } = ctx || {};
  const { form, field, params } = payload || {};

  const { model } = params || {};

  const { execKey } = execInfo || {};

  console.log(execKey, form.id);

  field.setComponentProps({
    apiConfig: {
      method: 'get',
      url: '/local-api/model-logic/list',
      params: {
        model,
        formId: form.id,
        execKey,
      },
    },
  });

  return {};
}

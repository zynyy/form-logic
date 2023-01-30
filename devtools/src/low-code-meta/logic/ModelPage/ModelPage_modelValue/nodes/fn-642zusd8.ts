// 函数节点

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  const { model } = form.values || {};

  form.query('codeSuffix').take((target) => {
    target.setComponentProps({
      addonBefore: model ? `${model}_` : '',
    });
  });

  return {};
}

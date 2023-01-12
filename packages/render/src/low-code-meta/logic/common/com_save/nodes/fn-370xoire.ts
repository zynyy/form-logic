// 函数节点
export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, params } = payload || {};

  const { formValues } = ctx.lastResult || {};

  try {
    const { formatFormValues } = params || {};

    if (formatFormValues) {
      const newFormValues = await formatFormValues?.(formValues, form);

      return {
        formValues: newFormValues,
      };
    }

    return {
      formValues,
    };
  } catch (err) {
    return {
      formValues,
    };
  }
}

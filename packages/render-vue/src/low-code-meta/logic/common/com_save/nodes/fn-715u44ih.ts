// 函数节点
export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, params } = payload || {};

  const { formValues } = ctx.lastResult || {};

  try {
    const { validateFormValues } = params || {};

    if (validateFormValues) {
      const success = await validateFormValues?.(formValues, form);

      return {
        success: success,
        formValues,
      };
    }

    return {
      success: true,
      formValues,
    };
  } catch (err) {
    return {
      success: false,
      formValues,
    };
  }
}

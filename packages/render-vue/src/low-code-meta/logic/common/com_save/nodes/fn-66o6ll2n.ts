// 函数节点
import { getSubmitFormValues } from '@/utils/formUtils';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  try {
    const formValues = await getSubmitFormValues(form);

    return {
      success: true,
      formValues,
    };
  } catch (e) {
    return {
      success: false,
    };
  }
}

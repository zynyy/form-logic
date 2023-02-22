// 函数节点
import { requestPost } from '@/service';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { params } = payload || {};

  const { formValues } = ctx.lastResult || {};

  const { action, extraParams } = params || {};

  try {
    const res = await requestPost(action, {
      ...formValues,
      ...extraParams,
    });

    const { code, data } = res || {};

    return {
      success: code === 200,
      data,
    };
  } catch (e) {
    return {
      success: false,
    };
  }
}

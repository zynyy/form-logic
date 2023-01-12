// 函数节点
import { requestGet } from '@/service';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  if (field.value) {
    requestGet('/local-api/model-page/check', {
      pageCode: field.value,
    }).then((res) => {
      const { data } = res;

    });
  }

  return {};
}

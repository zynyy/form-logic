// 数据节点
import { toArray } from '@/utils';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, params } = payload || {};

  const { tableColumns } = params || {};

  form.query('parentCode').take((target) => {
    target.setComponentProps({
      data: toArray(tableColumns),
    });
  });

  return {};
}

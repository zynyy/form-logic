// 数据节点
import { toArray } from '@formlogic/render-core-vue3';

import { LogicCtxArgs } from '@/interface';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, params } = payload || {};

  const { code } = form.values || {};

  const { groups } = params || {};

  form.query('modeCodes').take((target) => {
    target.setComponentProps({
      data: toArray(groups).filter((item) => {
        return item.code !== code;
      }),
    });
  });

  return {};
}

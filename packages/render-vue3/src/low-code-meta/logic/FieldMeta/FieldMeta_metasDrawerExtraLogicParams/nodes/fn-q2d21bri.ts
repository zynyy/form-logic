// 函数节点

import { toArray } from '@formlogic/render-core-vue3';

import { LogicCtxArgs } from '@/interface';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  const { categorize } = form.values || {};

  form.query('metas').take((target) => {
    target.setComponentProps({
      drawerExtraLogicParams: {
        categorize: toArray(categorize).map((item) => {
          const { code, name } = item;
          return {
            code,
            name,
          };
        }),
      },
    });
  });

  return {};
}

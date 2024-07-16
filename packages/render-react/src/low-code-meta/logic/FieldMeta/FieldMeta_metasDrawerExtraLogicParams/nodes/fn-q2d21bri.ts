// 函数节点


import { LogicCtxArgs } from '@/interface';
import { toArray } from '@/utils';

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

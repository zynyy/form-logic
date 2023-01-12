// 函数节点
import { LogicCtxArgs,  } from '@/interface';
import { toArray } from '@/utils';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  const { group } = form.values || {};

  form.query('group').take((target) => {
    target.setComponentProps({
      drawerExtraLogicParams: {
        groups: toArray(group).map((item) => {
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

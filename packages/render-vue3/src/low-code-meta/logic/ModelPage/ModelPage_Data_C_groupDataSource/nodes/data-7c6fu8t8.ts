// 数据节点
import { LogicCtxArgs } from '@/interface';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, params } = payload || {};

  const { groups } = params;

  form.query('group').take((target) => {
    target.setComponentProps({
      data: groups,
    });
  });

  return {};
}

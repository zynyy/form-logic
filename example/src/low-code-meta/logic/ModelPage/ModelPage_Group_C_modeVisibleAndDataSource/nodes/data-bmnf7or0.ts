// 数据节点
import { LogicCtxArgs, toArray } from '@formlogic/render';

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

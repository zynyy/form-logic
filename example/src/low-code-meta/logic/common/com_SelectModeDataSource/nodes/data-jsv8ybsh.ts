// 数据节点
import { LogicCtxArgs } from '@formlogic/render';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  field.setComponentProps({
    data: [
      {
        code: 'multiple',
        name: '多选',
      },
      {
        code: 'tags',
        name: '标签',
      },
    ],
  });

  return {};
}

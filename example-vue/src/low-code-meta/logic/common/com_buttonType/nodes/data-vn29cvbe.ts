// 数据节点
import { LogicCtxArgs } from '@formlogic/render-vue';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { field } = payload || {};

  field.setComponentProps({
    data: [
      {
        code: 'primary',
        name: '主按钮',
      },
      {
        code: 'default',
        name: '次按钮',
      },
      {
        code: 'dashed',
        name: '虚线按钮',
      },
      {
        code: 'text',
        name: '文本按钮',
      },
      {
        code: 'link',
        name: '链接按钮',
      },
    ],
  });

  return {};
}

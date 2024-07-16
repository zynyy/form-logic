// 函数节点
import { toArray } from '@formlogic/render-core-vue2';

import { LogicCtxArgs, MetaDataTypeEnum } from '@/interface';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  const { model, codeSuffix, group, data } = form.values || {};

  form.query('data').take((target) => {
    target.setComponentProps({
      drawerExtraLogicParams: {
        tableColumns: toArray(data)
          .filter((item) => item.type === MetaDataTypeEnum.table_column)
          .map((item) => {
            const { code, name } = item;
            return {
              code,
              name,
            };
          }),

        model,
        code: codeSuffix ? `${model}_${codeSuffix}` : '',
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

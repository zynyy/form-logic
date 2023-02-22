// 数据节点
import { fieldResetValue, getPathValue, LogicCtxArgs, MetaDataTypeEnum } from '@formlogic/render-vue';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, params, field } = payload || {};

  const { model } = params || {};

  const { type } = form.values || {};

  const isColumn = type?.endsWith('column');
  const isButton = type?.endsWith('button');
  const isContainer = MetaDataTypeEnum.container === type;

  form.query('code').take((target) => {
    if (field.modified) {
      const prevType = getPathValue<string, object>(target, [
        'componentProps',
        'apiConfig',
        'params',
        'type',
      ]);

      if (
        prevType === MetaDataTypeEnum.container ||
        (prevType?.endsWith('column') && !isColumn) ||
        (prevType?.endsWith('button') && !isButton)
      ) {
        fieldResetValue(form, ['code', 'name']);
      }
    }

    target.setComponentProps({
      apiConfig: {
        method: 'get',
        url: '/local-api/model-filed/list',
        params: {
          model,
          type,
          isContainer,
          isColumn,
          isButton,
        },
      },
    });
  });

  return {};
}

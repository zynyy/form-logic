// 函数节点
import { fieldResetValue, LogicCtxArgs } from '@formlogic/render';

export default async function (ctx: LogicCtxArgs) {
  const { payload, execInfo } = ctx || {};
  const { form, field } = payload || {};

  const visible = !!field.value;

  const { fieldCode } = execInfo;

  const fieldCodeArray = fieldCode.split('.');

  fieldCodeArray[fieldCodeArray.length - 1] = 'componentProps';

  const pattern = fieldCodeArray.join('.');

  if (!visible && field.modified) {
    fieldResetValue(form, [pattern]);
    form.query(pattern).take((target) => {
      target.setComponentProps({
        pageCode: '',
      });
    });
  }

  return {
    success: visible,
  };
}

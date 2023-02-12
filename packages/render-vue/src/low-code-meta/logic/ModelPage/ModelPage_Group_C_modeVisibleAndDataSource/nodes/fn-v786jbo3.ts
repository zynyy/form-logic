// 函数节点
import { fieldVisible } from '@/utils/formUtils';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const visible = !!field.value;

  fieldVisible(form, visible, ['modeCodes'], []);

  return {
    success: visible,
  };
}

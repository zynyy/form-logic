// 函数节点
import { fieldDisabled } from '@formlogic/render-vue';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const disabled = !field.value;

  fieldDisabled(form, disabled, ['codeSuffix', 'data.addBtn']);

  return {};
}

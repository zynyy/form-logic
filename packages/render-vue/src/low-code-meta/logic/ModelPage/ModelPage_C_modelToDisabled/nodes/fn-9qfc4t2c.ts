// 函数节点


import { fieldDisabled } from '@/utils/formUtils';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const disabled = !field.value;

  fieldDisabled(form, disabled, ['codeSuffix', 'data.addBtn']);

  return {};
}

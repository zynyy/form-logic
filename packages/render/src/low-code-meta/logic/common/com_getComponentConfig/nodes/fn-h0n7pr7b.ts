// 函数节点
import {  LogicCtxArgs } from '@/interface';
import { fieldVisible } from '@/utils/formUtils';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const visible = !!field.value;

  fieldVisible(form, visible, ['componentProps', 'componentProps.*'], []);

  return {
    success: visible,
  };
}

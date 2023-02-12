// 函数节点
import { fieldVisible } from '@/utils/formUtils';
import {LogicCtxArgs} from '@/interface'

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const visible = !!field.value;

  fieldVisible(form, visible, ['propsInfo', 'componentProps'], []);

  form.query('componentProps').take((target) => {
    target.setComponentProps({
      pageCode: field.value,
    });
  });

  return {};
}

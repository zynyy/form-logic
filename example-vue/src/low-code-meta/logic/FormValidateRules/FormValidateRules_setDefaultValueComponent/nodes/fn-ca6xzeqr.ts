// 函数节点
import { fieldSetValue, LogicCtxArgs } from '@formlogic/render-vue';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const component = field.value;

  form.query('defaultValue').take((target) => {
    target.componentProps = {};
    target.setComponent(component || 'Input', {});

    if (target.pattern !== 'readOnly') {
      target.disabled = !component;
    }
  });

  if (field.modified) {
    fieldSetValue(form, 'defaultValue', undefined, false);
  }

  return {};
}

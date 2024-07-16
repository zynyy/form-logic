// 函数节点


import { LogicCtxArgs } from '@/interface';
import { toArray } from '@/utils';
import { isField } from '@formily/core';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const { inputValues, modified } = field || {};

  if (modified) {
    const record = toArray(inputValues)[1] || {};

    const { name, defaultConfig } = record || {};

    Object.keys(defaultConfig || {}).forEach((key) => {
      const target = form.query(key).take();
      if (isField(target)) {
        target.onInput(defaultConfig[key]);
      } else {
        form.setValuesIn(key, defaultConfig[key]);
      }
    });

    const nameTarget = form.query('name').take();

    if (isField(nameTarget)) {
      nameTarget.onInput(name);
    } else {
      form.setValuesIn('name', 'name');
    }
  }

  return {};
}

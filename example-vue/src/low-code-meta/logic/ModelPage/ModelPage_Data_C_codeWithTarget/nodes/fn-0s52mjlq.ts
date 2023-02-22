// 函数节点
import { LogicCtxArgs, toArray, isField } from '@formlogic/render-vue';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const { inputValues, modified } = field || {};

  if (modified) {
    const record = toArray(inputValues)[1] || {};

    const { name, defaultConfig } = record || {};
    const config = defaultConfig || {};

    if (Object.keys(config).length) {
      form.setInitialValues(defaultConfig);
    }

    Object.keys(config).forEach((key) => {
      const target = form.query(key).take();

      const val = config[key];

      if (isField(target)) {
        form.setInitialValuesIn(key, val);

        if (key === 'component' && val) {
          target.onInput(val, {
            defaultChange: true,
          });
        } else {
          target.onInput(val);
        }
      } else {
        form.setValuesIn(key, val);
      }
    });

    if (!('component' in config)) {
      const target = form.query('component').take();

      if (target) {
        form.query('componentProps').take((target) => {
          if (isField(target)) {
            target.onInput({});
          }
        });

        if (isField(target)) {
          target.onInput('');
        }
      }
    }

    const nameTarget = form.query('name').take();

    if (isField(nameTarget)) {
      nameTarget.onInput(name);
    } else {
      form.setValuesIn('name', name);
    }
  }

  return {};
}

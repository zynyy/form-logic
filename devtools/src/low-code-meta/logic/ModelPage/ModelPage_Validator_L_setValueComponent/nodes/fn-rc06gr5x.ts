// 函数节点
import { LogicCtxArgs, isField } from '@formlogic/render';
import { requestGet } from '@/service';

export default async function (ctx: LogicCtxArgs) {
  const { payload, execInfo } = ctx || {};
  const { field } = payload || {};

  const { execKey, execNumRef, currentExecNum, clearExecNum } = execInfo || {};

  if (field.value) {
    requestGet('/local-api/validate-rules/validateRuleConfig', {
      validateRules: field.value,
    }).then((res) => {
      if (currentExecNum === execNumRef.current[execKey]) {
        const { data } = res || {};

        const { component, componentProps, defaultValue } = data;

        field.query('.validatorRuleValue').take((target) => {
          if (field.modified && isField(target)) {
            target.onInput(undefined);
          }

          if (target.component !== component) {
            target.componentProps = {};
            debugger
            target.setComponent(component || "", componentProps);
          }

          if (defaultValue && isField(target)) {
            target.onInput(defaultValue);
          }
        });

        clearExecNum();
      }
    });
  }

  return {};
}

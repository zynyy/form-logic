// 数据节点
import { requestGet } from '@/utils/request';
import { LogicCtxArgs } from '@/interface';

export default async function (ctx: LogicCtxArgs) {
  const { payload, execInfo } = ctx || {};
  const { form, field } = payload || {};

  const { currentExecNum, execNumRef, execKey } = execInfo;

  if (field.value) {
    requestGet('/local-api/component/componentConfig', {
      componentCode: field.value,
    }).then((res) => {
      if (currentExecNum === execNumRef.current[execKey]) {
        const { data } = res;

        const { componentProps, pageCode } = data;

        if (pageCode) {
          form.query('componentProps').take((target) => {
            target.setComponentProps({
              pageCode,
            });
          });
        }

        if (field.modified) {
          form.setValuesIn('componentProps', componentProps);
        }
      }
    });
  }

  return {};
}

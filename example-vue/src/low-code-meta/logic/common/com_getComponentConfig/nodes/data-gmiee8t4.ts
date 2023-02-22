// 数据节点
import { requestGet } from '@/service';
import { LogicCtxArgs } from '@formlogic/render-vue';

export default async function (ctx: LogicCtxArgs) {
  const { payload, execInfo } = ctx || {};
  const { form, field } = payload || {};

  const { currentExecNum, execNumRef, execKey, fieldCode } = execInfo;

  if (field.value) {
    requestGet('/local-api/component/componentConfig', {
      componentCode: field.value,
    }).then((res) => {
      if (currentExecNum === execNumRef.current[execKey]) {
        const { data } = res;

        const { componentProps, pageCode } = data;

        const fieldCodeArray = fieldCode.split('.');

        fieldCodeArray[fieldCodeArray.length - 1] = 'componentProps';

        const pattern = fieldCodeArray.join('.');

        const [_, inputValues] = field.inputValues || [];

        const { defaultChange } = inputValues || {};

        if (field.modified && !defaultChange) {
          form.setInitialValuesIn(pattern, componentProps);
          form.setInitialValues({
            componentProps,
          });
        }

        form.query(pattern).take((target) => {
          target.setComponentProps({
            pageCode: pageCode || '',
          });
        });
      }
    });
  }

  return {};
}

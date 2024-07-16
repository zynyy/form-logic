// 函数节点
import { requestGet } from '@/utils/request';
import { fieldSetValue } from '@/utils/formUtils';

export default async function (ctx) {
  const { payload, execInfo } = ctx || {};
  const { form, field } = payload || {};

  const { currentExecNum, execKey, execNumRef } = execInfo || {};

  if (field.value) {
    requestGet('/local-api/sequential', { time: field.value }).then((res) => {
      if (execNumRef.current[execKey] === currentExecNum) {
        fieldSetValue(form, 'name', res.data);
      }
    });
  }

  return {};
}

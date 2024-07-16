// 数据节点

import { requestGet } from '@/utils/request';
import { LogicCtxArgs } from '@/interface';
import { toArray } from '@/utils';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, params } = payload || {};

  const { categorize } = params || {};

  requestGet('/local-api/field-meta/categorize/list')
    .then((res) => {
      const { data } = res;
      form.query('categorize').take((target) => {
        target.setComponentProps({
          data: toArray(categorize).concat(data),
        });
      });
    })
    .catch(() => {
      form.query('categorize').take((target) => {
        target.setComponentProps({
          data: toArray(categorize),
        });
      });
    });

  return {};
}

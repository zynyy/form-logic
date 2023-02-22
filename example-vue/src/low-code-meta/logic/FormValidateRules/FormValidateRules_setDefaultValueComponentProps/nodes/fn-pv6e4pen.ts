// 函数节点
import { LogicCtxArgs } from '@formlogic/render-vue';

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  const componentProps = form.getValuesIn('componentProps') || {};

  form.query('defaultValue').take((target) => {


    target.setComponentProps(componentProps);



  });

  return {};
}

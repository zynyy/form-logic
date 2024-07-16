// 函数节点
import { fieldVisible } from '@formlogic/render-core-vue2';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  const { schemaType } = form.values || {};

  switch (schemaType) {
    case 'string': {
      fieldVisible(form, true, ['required', 'disabled'], ['pageCode', 'hasSerialNo', 'hasSort']);
      break;
    }
    case 'void': {
      fieldVisible(form, true, [], ['pageCode', 'required', 'disabled', 'hasSerialNo', 'hasSort']);
      break;
    }

    case 'array': {
      fieldVisible(form, true, ['required', 'disabled', 'pageCode', 'hasSerialNo', 'hasSort'], []);
      break;
    }
    case 'object': {
      fieldVisible(form, true, ['pageCode'], ['hasSerialNo', 'hasSort']);

      break;
    }

    default: {
    }
  }

  return {};
}

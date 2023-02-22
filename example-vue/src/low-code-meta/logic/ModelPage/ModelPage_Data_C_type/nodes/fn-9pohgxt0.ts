// 函数节点
import { fieldVisible } from '@formlogic/render-vue';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form } = payload || {};

  const { type } = form.values || {};

  const isColumn = type?.endsWith('column');

  fieldVisible(
    form,
    isColumn,
    ['defaultValue', 'configInfo', 'required', 'disabled', 'hidden', 'validatorInfo', 'validator'],
    ['eventCode'],
  );

  switch (type) {
    case 'column': {
      fieldVisible(form, true, ['layoutInfo', 'group'], ['parentCode']);
      break;
    }
    case 'table_column': {
      fieldVisible(form, true, ['parentCode', 'defaultValue'], ['layoutInfo']);

      break;
    }

    case 'search_column': {
      fieldVisible(form, true, ['layoutInfo'], ['parentCode', 'group']);

      break;
    }
    case 'button':
    case 'table_button':
    case 'search_button': {
      fieldVisible(form, true, [], ['parentCode', 'layoutInfo']);
      break;
    }

    default: {
    }
  }

  return {};
}

// 函数节点
import { fieldDisabled, fieldSetValue, MetaDataTypeEnum } from '@formlogic/render';

export default async function (ctx) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const { type } = form.values || {};

  const voidValue = type?.endsWith('button') || type === MetaDataTypeEnum.container;

  fieldDisabled(form, voidValue, ['schemaType']);

  if (field.modified) {
    fieldSetValue(form, 'schemaType', voidValue ? 'void' : undefined);
  }

  return {};
}

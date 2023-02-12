// 函数节点
import { LogicCtxArgs, MetaDataTypeEnum } from '@/interface';
import { fieldDisabled, fieldSetValue,} from '@/utils/formUtils'

export default async function (ctx: LogicCtxArgs) {
  const { payload } = ctx || {};
  const { form, field } = payload || {};

  const { type } = form.values || {};

  const voidValue = type?.endsWith('button') || type === MetaDataTypeEnum.container;

  fieldDisabled(form, voidValue, ['schemaType']);

  if (field.modified) {
    fieldSetValue(form, 'schemaType', voidValue ? 'void' : 'string');
  }

  return {};
}

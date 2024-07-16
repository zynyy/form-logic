import {
  IFormProps,
  booleanType,
  functionType,
  objectType,
  stringType,
} from '@formlogic/render-core-vue3';
import { ExtractPropTypes } from 'vue';

import { RequestConfig } from '@/utils/request';

export const getFormDialogProps = () => {
  return {
    dialogExtraLogicParams: objectType<Record<string, any>>(),
    dialogPageCode: stringType(),
    dialogTitle: stringType(),
    dialogFormConfig: objectType<IFormProps>(),
    dialogDetailApiConfig: objectType<RequestConfig>(),
    hasConfirmButton: booleanType(true),
    dialogValidateFormValues: functionType<(formValues: any) => Promise<string>>(),
  };
};

export interface DialogEvent {
  confirm?: (formValues: Record<string, any>) => void;
  reRequest?: () => void;
}

export type FormDialogProps = ExtractPropTypes<ReturnType<typeof getFormDialogProps>>;

import {
  IFormProps,
  booleanType,
  functionType,
  objectType,
  stringType,
} from '@formlogic/render-core-vue3';
import { ExtractPropTypes } from 'vue';

import { RequestConfig } from '@/utils/request';

export const getFormDrawerProps = () => {
  return {
    drawerExtraLogicParams: objectType<Record<string, any>>(),
    drawerPageCode: stringType(),
    drawerTitle: stringType(),
    drawerFormConfig: objectType<IFormProps>(),
    drawerDetailApiConfig: objectType<RequestConfig>(),
    hasConfirmButton: booleanType(true),
    drawerValidateFormValues: functionType<(formValues: any) => Promise<string>>(),
  };
};

export interface DrawerEvent {
  confirm?: (formValues: Record<string, any>) => void;
  reRequest?: () => void;
}

export type FormDrawerProps = ExtractPropTypes<ReturnType<typeof getFormDrawerProps>>;

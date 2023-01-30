import { EffectHook } from '@formlogic/render';

export interface ExecLogicListItem {
  formId: string;
  effectHook: EffectHook;
  pageCode: string;
  fieldCode: string;
  logicCode: string;
  time: number;
  createTime: string;
  doneTime: string;
  uid: string;
}

export enum FormLogicDevtoolsScript {
  popup = '@formlogic-devtools-popup-script',
  panel = '@formlogic-devtools-panel-script',
  app = '@formlogic-devtools-app-script',
  background = '@formlogic-devtools-background-script',
  inject = '@formlogic-devtools-inject-script',
}

import { VueComponent } from '@formlogic/code-render';
import { Form } from '@formily/core';
import { CSSProperties } from '@vue/runtime-dom';

export interface ISettingFormProps {
  className?: string;
  style?: CSSProperties;
  uploadAction?: string;
  components?: Record<string, VueComponent<any>>;
  effects?: (form: Form) => void;
  scope?: any;
  headers?: Record<string, string>;
}

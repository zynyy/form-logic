import {
  EffectHookSelect,
  FieldTypeSelect,
  FormPageLayoutProps,
  GroupModeSelect,
  JsonPopover,
  RequestMethodSelect,
  SchemaTypeSelect,
} from '@formlogic/render';
import PagePreviewButton from './page-preview-button';
import PageSortButton from './sort-button';
import BatchAddModelPageField from './batch-add';
import BatchSettingModelPageField from './batch-setting-config';

export const components: FormPageLayoutProps['components'] = {
  SchemaTypeSelect,
  FieldTypeSelect,
  GroupModeSelect,
  RequestMethodSelect,
  EffectHookSelect,
  JsonPopover,
  PagePreviewButton,
  PageSortButton,
  BatchAddModelPageField,
  BatchSettingModelPageField,
};

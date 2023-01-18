import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  EffectHookSelect,
  FieldTypeSelect,
  FormConfigProps,
  GroupModeSelect,
  JsonPopover,
  RequestMethodSelect,
  SchemaTypeSelect,
  FormPageLayoutProps,
} from '@formlogic/render';
import { modelPageDetail } from './services';
import PageCodeSelect from '@/components/page-code-select';
import PagePreviewButton from '@/pages/development/model-page/component/page-preview-button';
import PageSortButton from '@/pages/development/model-page/component/sort-button';
import BatchAddModelPageField from '@/pages/development/model-page/component/batch-add';
import BatchSettingModelPageField from '@/pages/development/model-page/component/batch-setting-config';

export const components: FormPageLayoutProps['components'] = {
  PageCodeSelect,
  SchemaTypeSelect,
  FieldTypeSelect,
  GroupModeSelect,
  RequestMethodSelect,
  EffectHookSelect,
  JsonPopover,
  PagePreviewButton,
  PageSortButton,
  BatchAddModelPageField,
  BatchSettingModelPageField
};

export const useModelPageDetail = (): [FormConfigProps, boolean] => {
  const [URLSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  const code = URLSearchParams.get('code');

  useEffect(() => {
    if (code) {
      setLoading(true);

      modelPageDetail({ pageCode: code })
        .then((res) => {
          const { data } = res;

          setFormConfig({
            initialValues: data,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [code]);

  return [formConfig, loading];
};

export const modelPageFormatFormValues = (formValues) => {
  const { codeSuffix, model } = formValues || {};

  return {
    ...formValues,
    code: `${model}_${codeSuffix}`,
  };
};

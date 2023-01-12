import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FormConfigProps } from '@formlogic/render';
import { modelPageDetail } from './services';

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

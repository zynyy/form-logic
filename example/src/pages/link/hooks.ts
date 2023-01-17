import { useEffect, useState } from 'react';
import type { FormilyForm, FormConfigProps, Components } from '@formlogic/render';
import { useSearchParams } from 'react-router-dom';

import { linkDetail } from './service';

export const components: Components = {};

// 验证表单值
export const validateFormValues: (
  formValues: any,
  form: FormilyForm,
) => Promise<boolean> = async () => {
  return true;
};

// 处理提交给后端的参数
export const formatFormValues: (formValues: any, form: FormilyForm) => any = (formValues, form) => {
  return formValues;
};

export const useLinkDetail = (): [FormConfigProps, boolean] => {
  const [URLSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  const code = URLSearchParams.get('code');

  useEffect(() => {
    if (code) {
      setLoading(true);

      linkDetail({ code })
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

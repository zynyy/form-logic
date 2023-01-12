import { FormConfigProps } from '@formlogic/render';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { componentDetail } from './services';


export const useComponentDetail = (): [FormConfigProps, boolean] => {
  const [URLSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  const code = URLSearchParams.get('code');

  useEffect(() => {
    if (code) {
      setLoading(true);

      componentDetail({ code })
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

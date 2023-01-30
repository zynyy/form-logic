import { FormConfigProps } from '@formlogic/render';
import { useEffect, useState } from 'react';
import { getModelPageDetail } from '@/service';

 const useModelPageDetail = (code?: string): [FormConfigProps, boolean] => {
  const [loading, setLoading] = useState(false);

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  useEffect(() => {
    if (code) {
      setLoading(true);

      getModelPageDetail({ pageCode: code })
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

export default useModelPageDetail

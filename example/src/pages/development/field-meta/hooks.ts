import { useEffect, useState } from 'react';
import { fieldMetaTree, fieldMetaDetail } from './services';
import { FormConfigProps } from '@formlogic/render';
import { useSearchParams } from 'react-router-dom';

export const useFieldMetaTree = () => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    fieldMetaTree().then((res) => {
      const { data } = res;
      setTreeData(data);
    });
  }, []);

  return [treeData];
};

export const useFieldMetaDetail = (): [FormConfigProps, boolean] => {
  const [URLSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  const code = URLSearchParams.get('code');

  useEffect(() => {
    if (code) {
      setLoading(true);

      fieldMetaDetail({ code })
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

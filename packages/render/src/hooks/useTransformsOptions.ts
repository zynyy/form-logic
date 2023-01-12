import { TransformsSchemaOptions } from '@/transforms';
import { useEffect, useState } from 'react';
import { getModelPageDetail } from '@/service';

export interface TransformsOptionsArgs extends Partial<TransformsSchemaOptions> {
  pageCode?: string;
}

export const useTransformsOptions = ({
  pageCode,
  metaSchema,
                                       pattern,
  hasGroup,
}: TransformsOptionsArgs): [TransformsSchemaOptions, boolean] => {
  const [options, setOptions] = useState<TransformsSchemaOptions | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pageCode) {
      setLoading(true);
      getModelPageDetail({
        pageCode,
      })
        .then((res) => {
          const { data } = res || {};
          setOptions({
            metaSchema: data,
            pattern,
            hasGroup,
          });

        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [pageCode]);

  useEffect(() => {

    if (metaSchema) {
      setOptions({
        metaSchema,
        pattern,
        hasGroup,
      });
    }
  }, [metaSchema]);

  return [options, loading];
};

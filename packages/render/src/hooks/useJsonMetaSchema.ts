import { MetaSchema } from '@/interface';
import { useEffect, useRef, useState } from 'react';

import { getJsonMetaSchema } from '@/utils';

interface JsonMetaSchema {
  metaSchema: MetaSchema;
  loading: boolean;
}

export const useJsonMetaSchema = (modelPageCode: string): JsonMetaSchema => {
  const [metaSchema, setMetaSchema] = useState(null);
  const [loading, setLoading] = useState(false);

  const prevPageCode = useRef<string>('');

  useEffect(() => {
    if (prevPageCode.current !== modelPageCode) {
      if (modelPageCode) {
        setLoading(true);
        getJsonMetaSchema(modelPageCode)
          .then((nextMetaSchema) => {
            prevPageCode.current = modelPageCode;
            setMetaSchema(nextMetaSchema);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            prevPageCode.current = '';
          });
      } else {
        setMetaSchema(null);
        prevPageCode.current = '';
      }
    }
  }, [modelPageCode]);

  return {
    metaSchema,
    loading,
  };
};

import { MetaSchema } from '@/interface';

import { getJsonMetaSchema } from '@/utils';
import { Ref, ref, watch, watchEffect } from 'vue';

interface JsonMetaSchema {
  metaSchema: Ref<MetaSchema>;
  loading: Ref<boolean>;
}

export const useJsonMetaSchema = (modelPageCode: Ref<string>): JsonMetaSchema => {
  const metaSchema = ref(null);
  const loading = ref(false);

  watchEffect(() => {
    if (modelPageCode.value) {
      loading.value = true;
      getJsonMetaSchema(modelPageCode.value)
        .then((nextMetaSchema) => {
          metaSchema.value = nextMetaSchema;

          loading.value = false;
        })
        .catch(() => {
          loading.value = false;
        });
    } else {
      metaSchema.value = null;
    }
  });

  return {
    metaSchema,
    loading,
  };
};

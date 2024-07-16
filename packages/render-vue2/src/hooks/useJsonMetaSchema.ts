import { Ref, ref, shallowRef, watch } from 'vue';

import { MetaSchema } from '@/interface';
import { getJsonMetaSchema } from '@/utils';

interface JsonMetaSchema {
  metaSchema: Ref<MetaSchema | undefined>;
  loading: Ref<boolean>;
}

export const useJsonMetaSchema = (modelPageCode: Ref<string>): JsonMetaSchema => {
  const metaSchema = shallowRef<MetaSchema>();
  const loading = ref(false);

  const fetchPageCode = () => {
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
      loading.value = false;
      metaSchema.value = undefined;
    }
  };

  watch(
    modelPageCode,
    () => {
      fetchPageCode();
    },
    {
      immediate: true,
    },
  );

  return {
    metaSchema,
    loading,
  };
};

import { TransformsSchemaOptions } from '@/transforms';

import { computed, Ref, ref, shallowRef, watchEffect } from 'vue';
import { MetaSchema, SchemaPattern } from '@/interface';
import { getJsonMetaSchema } from '@/utils';

export interface TransformsOptionsArgs {
  pageCode?: Ref<string>;
  metaSchema: Ref<MetaSchema>;
  pattern?: Ref<SchemaPattern>;
  hasGroup?: Ref<boolean>;
}

export const useTransformsOptions = ({
  pageCode,
  metaSchema,
  pattern,
  hasGroup,
}: TransformsOptionsArgs): {
  options: Ref<TransformsSchemaOptions | undefined>;
  loading: Ref<boolean>;
} => {
  const loading = ref<boolean>(false);
  const metaSchemaRef = shallowRef<MetaSchema>(undefined);

  watchEffect(() => {
    if (pageCode.value) {
      loading.value = true;

      getJsonMetaSchema(pageCode.value)
        .then((data) => {
          metaSchemaRef.value = data;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });

  watchEffect(() => {
    if (metaSchema.value) {
      metaSchemaRef.value = metaSchema.value;
    }
  });

  const optionsRef = computed(() => {

    return {
      metaSchema: metaSchemaRef.value,
      pattern: pattern?.value,
      hasGroup: hasGroup?.value,
    };
  });

  return {
    options: optionsRef,
    loading,
  };
};

import { SchemaPattern, SchemaPatternEnum } from '@formlogic/render-core-vue2';
import qs from 'qs';
import { Ref, ShallowRef, computed, onMounted, ref, shallowRef, watch } from 'vue';

import { MetaSchema } from '@/interface';
import { TransformsSchemaOptions } from '@/transforms';
import { getJsonMetaSchema } from '@/utils';

export interface TransformsOptionsArgs {
  pageCode?: Ref<string | undefined>;
  metaSchema?: Ref<MetaSchema | undefined>;
  pattern?: Ref<SchemaPattern>;
  hasGroup?: Ref<boolean>;
  hasSerialNo?: Ref<boolean>;
  detailKey?: string;
  hasUrlPattern?: boolean;
}

export const useTransformsOptions = ({
  pageCode,
  metaSchema,
  pattern,
  hasGroup,
  hasSerialNo,
  detailKey,
  hasUrlPattern,
}: TransformsOptionsArgs): {
  options: Ref<TransformsSchemaOptions>;
  loading: Ref<boolean>;
  nextMetaSchema: ShallowRef<MetaSchema | undefined>;
} => {
  const loading = ref<boolean>(false);
  const metaSchemaRef = shallowRef<MetaSchema>();

  const urlQuery = qs.parse(new URLSearchParams(location.search).toString());

  const setPageMetaSchema = () => {
    if (pageCode && pageCode.value) {
      loading.value = true;
      getJsonMetaSchema(pageCode.value)
        .then((data) => {
          metaSchemaRef.value = data;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };

  watch(
    () => pageCode?.value,
    () => {
      setPageMetaSchema();
    },
  );

  watch(
    () => {
      return JSON.stringify(metaSchema?.value || {});
    },
    () => {
      if (metaSchema && metaSchema.value) {
        metaSchemaRef.value = metaSchema.value;
      }
    },
  );

  onMounted(() => {
    setPageMetaSchema();
    if (metaSchema && metaSchema.value) {
      metaSchemaRef.value = metaSchema.value;
    }
  });

  const optionsRef = computed(() => {
    let nextPattern = pattern?.value ?? SchemaPatternEnum.EDITABLE;

    if (hasUrlPattern) {
      const { pattern: urlPattern } = urlQuery;
      if (urlPattern) {
        nextPattern = (urlPattern as string)?.toLocaleUpperCase() as SchemaPattern;
      }
    }

    return {
      metaSchema: metaSchemaRef.value as MetaSchema,
      pattern: nextPattern,
      hasGroup: hasGroup?.value ?? false,
      hasSerialNo: hasSerialNo?.value ?? true,
      detailKey,
    };
  });

  return {
    options: optionsRef,
    loading,
    nextMetaSchema: metaSchemaRef,
  };
};

import { clone } from '@formily/shared';
import { Schema } from '@formily/json-schema';
import { nextTick, Ref, ref, watchEffect, computed } from 'vue';

import { useSchemeFormContent } from '@/scheme-form/hooks';

import type { PropertiesSchema } from '@/transforms';
import { TransformsSchema } from '@/transforms';
import { AnyObject, MetaSchema } from '@/interface';

import { getFieldIndexes } from '@/utils/formUtils';

import { useField, useFieldSchema, useForm } from '@/formily-vue';

import { loop } from '@/utils';
import { useBindBtnClick, useBindLogic } from '@/hooks/useLogic';

export const useDynamicSchema = (
  metaSchema: Ref<MetaSchema>,
  cb?: (args: AnyObject) => void,
): {
  schemaRef: Ref<Schema>;
  doneRef: Ref<boolean>;
} => {
  const form = useForm();
  const field = useField();

  const fieldSchema = useFieldSchema();

  const doneRef = ref(false);

  const schemeFormContentRef = useSchemeFormContent();

  const schemaRef = ref<PropertiesSchema>({
    propertiesSchema: null,
    buttons: [],
    logicList: [],
    btnFields: [],
    pattern: schemeFormContentRef.value.pattern,
    transformsDone: false,
  });

  const prefixField = getFieldIndexes(field.value);

  watchEffect((onCleanup) => {
    doneRef.value = false;

    const { pattern } = schemeFormContentRef.value;

    if (metaSchema.value) {
      const options = {
        metaSchema: metaSchema.value,
        hasGroup: false,
        pattern,
      };

      const transformsSchema = new TransformsSchema(options);

      schemaRef.value = transformsSchema.getPropertiesSchema(prefixField);
    } else {
      schemaRef.value = {
        propertiesSchema: null,
        buttons: [],
        logicList: [],
        btnFields: [],
        pattern,
        transformsDone: true,
      };
    }

    onCleanup(() => {
      schemaRef.value = {
        propertiesSchema: null,
        buttons: [],
        logicList: [],
        btnFields: [],
        pattern,
        transformsDone: false,
      };
    });
  });

  const bindBtnClickOptions = computed(() => {
    const { btnFields, transformsDone } = schemaRef.value;
    const { getLogicConfig, extraLogicParams, events } = schemeFormContentRef.value;

    return {
      form: form.value,
      btnList: btnFields,
      getLogicConfig,
      logicParams: extraLogicParams,
      events,
      cb,
      autoLogic: transformsDone,
    };
  });

  const bindLogicOptions = computed(() => {
    const { logicList, transformsDone } = schemaRef.value;
    const { getLogicConfig, extraLogicParams } = schemeFormContentRef.value;

    return {
      autoLogic: transformsDone,
      logicList,
      getLogicConfig,
      logicParams: extraLogicParams,
      cb,
    };
  });

  const doneFormIdRef = useBindLogic(form, bindLogicOptions);

  const btnDoneFormIdRef = useBindBtnClick(bindBtnClickOptions);

  const removeProperty = () => {
    if (Object.keys(fieldSchema.value.properties || {}).length) {
      for (const key in fieldSchema.value.properties) {
        fieldSchema.value.removeProperty(key);
      }
      const pattern = `${field.value.address.entire}.*`;
      form.value.clearFormGraph(pattern);
    }
  };

  watchEffect(() => {
    const { propertiesSchema } = schemaRef.value;

    if (doneFormIdRef.value && btnDoneFormIdRef.value) {
      if (propertiesSchema) {
        removeProperty();
        fieldSchema.value.setProperties(clone(propertiesSchema));

        nextTick(() => {
          doneRef.value = true;
        }).then(loop);
      }
      if (!propertiesSchema) {
        removeProperty();
        nextTick(() => {
          doneRef.value = true;
        }).then(loop);
      }
    }
  });

  return {
    schemaRef: fieldSchema,
    doneRef,
  };
};

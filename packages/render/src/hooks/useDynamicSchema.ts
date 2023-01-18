import { useBindBtnClick, useBindLogic } from '@/hooks/useLogic';
import { useForm, useFieldSchema, useField, Schema } from '@formily/react';
import { useSchemeFormContent } from '@/scheme-form/hooks';
import { useEffect, useState } from 'react';
import type { PropertiesSchema } from '@/transforms';
import { TransformsSchema } from '@/transforms';
import { AnyObject, MetaSchema } from '@/interface';
import useForceUpdate from '@/hooks/useForceUpdate';
import { clone } from '@formily/shared';
import {useDeepEffect} from '@formlogic/component';
import { getFieldIndexes } from '@/utils/formUtils';

export const useDynamicSchema = (
  metaSchema: MetaSchema,
  cb?: (args: AnyObject) => void,
): [Schema, boolean] => {
  const form = useForm();
  const field = useField();

  const fieldSchema = useFieldSchema();

  const forceUpdate = useForceUpdate();

  const { pattern, getLogicConfig, extraLogicParams, events } = useSchemeFormContent();

  const [schema, setPropertiesSchema] = useState<PropertiesSchema>({
    propertiesSchema: null,
    buttons: [],
    logicList: [],
    btnFields: [],
    pattern,
    transformsDone: false,
  });

  const { propertiesSchema, transformsDone, btnFields, logicList } = schema || {};

  const prefixField = getFieldIndexes(field);

  useEffect(() => {
    if (metaSchema) {
      const options = {
        metaSchema,
        hasGroup: false,
        pattern,
      };

      const transformsSchema = new TransformsSchema(options);

      const schema = transformsSchema.getPropertiesSchema(prefixField);

      setPropertiesSchema(schema);
    } else {
      setPropertiesSchema({
        propertiesSchema: null,
        buttons: [],
        logicList: [],
        btnFields: [],
        pattern,
        transformsDone: true,
      });
    }

    return () => {
      setPropertiesSchema({
        propertiesSchema: null,
        buttons: [],
        logicList: [],
        btnFields: [],
        pattern,
        transformsDone: false,
      });
    };
  }, [metaSchema, pattern]);

  const [btnDoneFormId] = useBindBtnClick({
    form,
    btnList: btnFields,
    getLogicConfig,
    logicParams: extraLogicParams,
    events,
    cb,
    autoLogic: transformsDone,
  });

  const [doneFormId] = useBindLogic({
    form,
    autoLogic: transformsDone,
    logicList,
    getLogicConfig,
    logicParams: extraLogicParams,
    cb,
  });

  const removeProperty = () => {
    if (Object.keys(fieldSchema.properties || {}).length) {
      for (const key in fieldSchema.properties) {
        fieldSchema.removeProperty(key);
      }
      const pattern = `${field.address.entire}.*`;
      form.clearFormGraph(pattern);
    }
  };

  useDeepEffect(() => {
    if (btnDoneFormId && doneFormId && propertiesSchema) {
      removeProperty();
      fieldSchema.setProperties(clone(propertiesSchema));
      forceUpdate();
    }
    if (!propertiesSchema) {
      removeProperty();
      forceUpdate();
    }
  }, [btnDoneFormId, doneFormId, propertiesSchema]);

  return [fieldSchema, !!(doneFormId && btnDoneFormId)];
};

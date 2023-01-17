import { useState } from 'react';
import {
  ModalPageForm,
  FormConfigProps,
  ListLayout,
  TransformsSchemaOptions,
  useJsonMetaSchema,
  useOpen,
  useReloadFlag,
  getJsonMetaSchema,
  SchemaPatternEnum,
} from '@formlogic/render';

import getLogicConfig from '@/low-code-meta/logic';

import { apiUrl, ValidateRulesConfig, validateRulesDetail, validateRulesRemove } from './service';

import { formatFormValues, validateFormValues,components } from './hooks';


const ValidateRulesList = () => {


  const { metaSchema } = useJsonMetaSchema(ValidateRulesConfig.LIST);

  const [options, setOptions] = useState<TransformsSchemaOptions>(null);
  const [open, showDrawer, hiddenDrawer] = useOpen();

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const [action, setAction] = useState(apiUrl.create);

  const handleAddClick = () => {
    getJsonMetaSchema(ValidateRulesConfig.CREATE).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });
    });

    setAction(apiUrl.create);

    showDrawer();
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    validateRulesRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    showDrawer();

    getJsonMetaSchema(ValidateRulesConfig.EDIT).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });
    });

    const { code } = record || {};
    validateRulesDetail({ code }).then((res) => {
      const { data } = res;
      setFormConfig({
        initialValues: data,
      });
    });
    setAction(apiUrl.update);
  };

  const handleDetailClick = (index, record) => {
    showDrawer();

    getJsonMetaSchema(ValidateRulesConfig.DETAIL).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
        pattern: SchemaPatternEnum.DETAIL,
      });
    });

    const { code } = record || {};
    validateRulesDetail({ code }).then((res) => {
      const { data } = res;
      setFormConfig({
        initialValues: data,
      });
    });
    setAction('');
  };

  const successCallback = () => {
    setOptions(null);
    refreshReloadFlag();
    hiddenDrawer();
  };

  return (
    <>
      <ListLayout
        getLogicConfig={getLogicConfig}
        metaSchema={metaSchema}
        action={apiUrl.page}
        reloadFlag={reloadFlag}
        onEdit={handleEditClick}
        onAdd={handleAddClick}
        onRemove={handleRemoveClick}
        onDetail={handleDetailClick}
      />

      <ModalPageForm
        open={open}
        options={options}
        onClose={hiddenDrawer}
        getLogicConfig={getLogicConfig}
        formConfig={formConfig}
        extraLogicParams={{
          successCallback,
          action,
          extraParams: {},
          validateFormValues,
          formatFormValues,
        }}
        components={components}
        hasConfirmButton={false}
      />
    </>
  );
};

export default ValidateRulesList;

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

import { apiUrl, ModalConfig, modalRemove, modalDetail } from './service';

import { formatFormValues, validateFormValues, components } from './hooks';

const ModalList = () => {
  const { metaSchema } = useJsonMetaSchema(ModalConfig.LIST);

  const [options, setOptions] = useState<TransformsSchemaOptions>(null);
  const [open, showModal, hiddenModal] = useOpen();

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const [action, setAction] = useState(apiUrl.create);

  const handleAddClick = () => {
    setAction(apiUrl.create);

    showModal();
    getJsonMetaSchema(ModalConfig.CREATE).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });
    });
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    modalRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    setAction(apiUrl.update);
    showModal();
    getJsonMetaSchema(ModalConfig.EDIT).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });
    });

    const { code } = record || {};
    modalDetail({ code }).then((res) => {
      const { data } = res;
      setFormConfig({
        initialValues: data,
      });
    });
  };

  const handleDetailClick = (index, record) => {
    setAction('');
    showModal();
    getJsonMetaSchema(ModalConfig.DETAIL).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
        pattern: SchemaPatternEnum.DETAIL,
      });
    });

    const { code } = record || {};
    modalDetail({ code }).then((res) => {
      const { data } = res;
      setFormConfig({
        initialValues: data,
      });
    });
  };

  const successCallback = () => {
    setOptions(null);
    refreshReloadFlag();
    hiddenModal();
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
        onClose={hiddenModal}
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

export default ModalList;

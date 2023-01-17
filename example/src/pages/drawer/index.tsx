import { useState } from 'react';
import {
  DrawerPageForm,
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

import { apiUrl, DrawerConfig, drawerRemove, drawerDetail } from './service';

import { formatFormValues, validateFormValues, components } from './hooks';

const DrawerList = () => {
  const { metaSchema } = useJsonMetaSchema(DrawerConfig.LIST);

  const [options, setOptions] = useState<TransformsSchemaOptions>(null);
  const [open, showDrawer, hiddenDrawer] = useOpen();

  const [formConfig, setFormConfig] = useState<FormConfigProps>({});

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const [action, setAction] = useState(apiUrl.create);

  const handleAddClick = () => {
    setAction(apiUrl.create);

    showDrawer();

    getJsonMetaSchema(DrawerConfig.CREATE).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });
    });
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    drawerRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    setAction(apiUrl.update);
    showDrawer();

    getJsonMetaSchema(DrawerConfig.EDIT).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
      });
    });

    const { code } = record || {};
    drawerDetail({ code }).then((res) => {
      const { data } = res;
      setFormConfig({
        initialValues: data,
      });
    });
  };

  const handleDetailClick = (index, record) => {
    setAction('');
    showDrawer();

    getJsonMetaSchema(DrawerConfig.DETAIL).then((metaSchema) => {
      setOptions({
        metaSchema,
        hasGroup: true,
        pattern: SchemaPatternEnum.DETAIL,
      });
    });

    const { code } = record || {};
    drawerDetail({ code }).then((res) => {
      const { data } = res;
      setFormConfig({
        initialValues: data,
      });
    });
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

      <DrawerPageForm
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

export default DrawerList;

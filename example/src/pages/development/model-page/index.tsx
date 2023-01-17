import { ListLayout, useJsonMetaSchema, useOpen, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import { apiUrl, ModelPageConfig, modelPageRemove } from './services';
import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';
import CopyModelPageDrawer from '@/pages/development/model-page/component/copy-model-page-drawer';
import { useState } from 'react';

const PageConfig = () => {
  const navigate = useNavigate();

  const [open, show, hidden] = useOpen();

  const {metaSchema} = useJsonMetaSchema(ModelPageConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const [pageCode, setPageCode] = useState('');

  const handleAddClick = () => {
    navigate(ModelPageConfig.CREATE_LINK);
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    modelPageRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    const { code } = record || {};
    navigate(getQueryUrl(ModelPageConfig.EDIT_LINK, { code }));
  };

  const handleCopy = (index, record) => {
    show();
    setPageCode(record?.code);
  };

  const handleClose = () => {
    hidden();
    refreshReloadFlag();
  };

  return (
    <>
      <ListLayout
        getLogicConfig={getLogicConfig}
        metaSchema={metaSchema}
        action={apiUrl.page}
        onEdit={handleEditClick}
        onAdd={handleAddClick}
        onRemove={handleRemoveClick}
        onCopy={handleCopy}
        reloadFlag={reloadFlag}
      />

      <CopyModelPageDrawer pageCode={pageCode} open={open} onClose={handleClose} />
    </>
  );
};

export default PageConfig;

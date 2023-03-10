import { ListLayout, useJsonMetaSchema, useReloadFlag } from '@formlogic/render';

import { apiUrl, ModelConfig, modelRemove } from './services';

import getLogicConfig from '@/low-code-meta/logic';
import { useNavigate } from 'react-router-dom';

import { getQueryUrl } from '@/utils/utils';

const Model = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(ModelConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const handleAddClick = () => {
    navigate(ModelConfig.CREATE_LINK);
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    modelRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(ModelConfig.EDIT_LINK, { code, belong }));
  };

  const handleDetailClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(ModelConfig.DETAIL_LINK, { code, belong }));
  }

  return (
    <ListLayout
      getLogicConfig={getLogicConfig}
      metaSchema={metaSchema}
      action={apiUrl.page}
      onEdit={handleEditClick}
      onAdd={handleAddClick}
      onRemove={handleRemoveClick}
      onDetail={handleDetailClick}
      reloadFlag={reloadFlag}
    />
  );
};

export default Model;

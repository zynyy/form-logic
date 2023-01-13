import { ListLayout, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';
import { useMetaSchema } from '@/hooks';
import { apiUrl, ModelPageConfig, modelPageRemove } from './services';
import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';

const PageConfig = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema(ModelPageConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

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

  return (
    <ListLayout
      getLogicConfig={getLogicConfig}
      metaSchema={metaSchema}
      action={apiUrl.page}
      onEdit={handleEditClick}
      onAdd={handleAddClick}
      onRemove={handleRemoveClick}
      reloadFlag={reloadFlag}
    />
  );
};

export default PageConfig;

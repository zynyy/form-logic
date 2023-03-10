import { ListLayout, useJsonMetaSchema, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import { apiUrl, ComponentConfig, componentRemove } from './services';
import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';

const Component = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(ComponentConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const handleAddClick = () => {
    navigate(ComponentConfig.CREATE_LINK);
  };

  const handleRemoveClick = (index, record) => {
    const { code, belong } = record || {};
    componentRemove({ code, belongCode: belong }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(ComponentConfig.EDIT_LINK, { code, belong }));
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

export default Component;

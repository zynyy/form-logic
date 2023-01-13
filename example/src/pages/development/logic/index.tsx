import { ListLayout, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';
import { useMetaSchema } from '@/hooks';
import { apiUrl, LogicConfig, logicRemove } from './services';
import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';

const Logic = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema(LogicConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const handleAddClick = () => {
    navigate(LogicConfig.CREATE_LINK);
  };

  const handleRemoveClick = (index, record) => {
    const { code, belong } = record || {};
    logicRemove({ code, belongCode: belong }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(LogicConfig.EDIT_LINK, { code, belong }));
  };

  const handleDetailClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(LogicConfig.DETAIL_LINK, { code, belong }));
  };

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

export default Logic;

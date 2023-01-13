import { ListLayout, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';
import { useMetaSchema } from '@/hooks';
import { apiUrl, FieldMetaConfig, fieldMetaRemove } from './services';
import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';

const FieldMeta = () => {
  const navigate = useNavigate();

  const [metaSchema] = useMetaSchema(FieldMetaConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const handleAddClick = () => {
    navigate(FieldMetaConfig.CREATE_LINK);
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    fieldMetaRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(FieldMetaConfig.EDIT_LINK, { code, belong }));
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

export default FieldMeta;

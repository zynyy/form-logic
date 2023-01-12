import { ListLayout, useJsonMetaSchema, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';
import { apiUrl, ValidateRulesConfig, validateRulesRemove } from './service';

const ValidateRulesList = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(ValidateRulesConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const handleAddClick = () => {
    navigate(ValidateRulesConfig.CREATE_LINK);
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    validateRulesRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(ValidateRulesConfig.EDIT_LINK, { code, belong }));
  };

  return (
    <ListLayout
      getLogicConfig={getLogicConfig}
      metaSchema={metaSchema}
      action={apiUrl.page}
      reloadFlag={reloadFlag}
      events={{
        onAdd: handleAddClick,
        onRemove: handleRemoveClick,
        onEdit: handleEditClick,
      }}
    />
  );
};

export default ValidateRulesList;

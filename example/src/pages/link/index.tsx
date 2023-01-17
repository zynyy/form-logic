import { ListLayout, useJsonMetaSchema, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';
import { apiUrl, LinkConfig, linkRemove } from './service';

const LinkList = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(LinkConfig.LIST);

  const [reloadFlag, refreshReloadFlag] = useReloadFlag();

  const handleAddClick = () => {
    navigate(LinkConfig.CREATE_LINK);
  };

  const handleRemoveClick = (index, record) => {
    const { code } = record || {};
    linkRemove({ code }).then(() => {
      refreshReloadFlag();
    });
  };

  const handleEditClick = (index, record) => {
    const { code } = record || {};
    navigate(getQueryUrl(LinkConfig.EDIT_LINK, { code }));
  };

  const handleDetailClick = (index, record) => {
    const { code } = record || {};
    navigate(getQueryUrl(LinkConfig.DETAIL_LINK, { code }));
  };

  return (
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
  );
};

export default LinkList;

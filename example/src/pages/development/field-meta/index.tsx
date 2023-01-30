import { ListLayout, useJsonMetaSchema, useReloadFlag } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import { apiUrl, FieldMetaConfig, fieldMetaRemove } from './services';
import getLogicConfig from '@/low-code-meta/logic';
import { getQueryUrl } from '@/utils/utils';
import { useEffect } from 'react';

const FieldMeta = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(FieldMetaConfig.LIST);

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

  const handleDetailClick = (index, record) => {
    const { code, belong } = record || {};
    navigate(getQueryUrl(FieldMetaConfig.DETAIL_LINK, { code, belong }));
  };

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const { data } = event || {};

      const { source, type } = data || {};

      if (source === '@formlogic-devtools-background-script') {
        if (type === 'connect') {
        } else if (type === 'disconnect') {
        }
      }
    });

    return () => {
      window.removeEventListener('message', () => {});
    };
  }, []);

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

export default FieldMeta;

import { ListLayout } from '@formlogic/render';

import { apiUrl, ModelConfig } from '@/pages/development/model/services';

import getLogicConfig from '@/low-code-meta/logic';
import { useNavigate } from 'react-router-dom';
import { useMetaSchema } from '@/hooks';

const Model = () => {
  const navigate = useNavigate();

  const metaSchema = useMetaSchema(ModelConfig.LIST);

  return (
    <ListLayout
      getLogicConfig={getLogicConfig}
      metaSchema={metaSchema}
      action={apiUrl.page}
      events={{
        onAdd: () => {
          navigate(ModelConfig.CREATE_LINK);
        },
      }}
    />
  );
};

export default Model;

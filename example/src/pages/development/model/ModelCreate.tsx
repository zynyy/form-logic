import { FormPageLayout } from '@formlogic/render';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLocalConfig } from '@formlogic/render/lib/service';

import { ModelConfig } from './services';
import { useMetaSchema } from '@/hooks';

const ModelCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const metaSchema = useMetaSchema(ModelConfig.CREATE);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <FormPageLayout
        onBackClick={handleBackClick}
        hasGroup
        metaSchema={metaSchema}
        getLogicConfig={getLocalConfig}
      />
    </>
  );
};

export default ModelCreate;

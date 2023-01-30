import { FormPageLayout, useJsonMetaSchema } from '@formlogic/render';
import { useNavigate } from 'react-router-dom';

import { apiUrl, ModelPageConfig } from './services';
import { components, useModelPageDetail } from './hooks';
import getLogicConfig from '@/low-code-meta/logic';

const ModelPageEdit = () => {
  const navigate = useNavigate();

  const {metaSchema} = useJsonMetaSchema(ModelPageConfig.EDIT);

  const [formConfig, loading] = useModelPageDetail();

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
 //   handleBackClick();
  };

  return (
    <FormPageLayout
      loading={loading}
      onBackClick={handleBackClick}
      hasGroup
      metaSchema={metaSchema}
      getLogicConfig={getLogicConfig}
      components={components}
      formConfig={formConfig}
      extraLogicParams={{
        successCallback,
        action: apiUrl.update,
        extraParams: {},
      }}
    />
  );
};

export default ModelPageEdit;

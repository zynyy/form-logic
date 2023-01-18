import { FormPageLayout, SchemaPatternEnum, useJsonMetaSchema } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';
import { useNavigate } from 'react-router-dom';
import { apiUrl, ModelPageConfig } from '@/pages/development/model-page/services';
import { components, useModelPageDetail } from '@/pages/development/model-page/hooks';

const ModelPageDetail = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(ModelPageConfig.DETAIL);

  const [formConfig, loading] = useModelPageDetail();

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
    handleBackClick();
  };

  return (
    <FormPageLayout
      pattern={SchemaPatternEnum.DETAIL}
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

export default ModelPageDetail;

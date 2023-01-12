import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPageLayout, useJsonMetaSchema } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';

import { ValidateRulesConfig, apiUrl } from './service';
import { validateFormValues, formatFormValues, useValidateRulesDetail } from './hooks';

interface ValidateRulesEditProps {}

const ValidateRulesEdit: FC<ValidateRulesEditProps> = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(ValidateRulesConfig.EDIT);

  const [formConfig, loading] = useValidateRulesDetail();

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
    handleBackClick();
  };

  return (
    <FormPageLayout
      hasGroup
      loading={loading}
      formConfig={formConfig}
      metaSchema={metaSchema}
      getLogicConfig={getLogicConfig}
      extraLogicParams={{
        successCallback,
        action: apiUrl.update,
        extraParams: {},
        validateFormValues,
        formatFormValues,
      }}
      onBackClick={handleBackClick}
    />
  );
};

export default ValidateRulesEdit;

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPageLayout, JsonPopover, RequestMethodSelect, useJsonMetaSchema } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';

import { ValidateRulesConfig, apiUrl } from './service';

import { validateFormValues, formatFormValues } from './hooks';

interface ValidateRulesCreateProps {}

const ValidateRulesCreate: FC<ValidateRulesCreateProps> = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(ValidateRulesConfig.CREATE);

  const handleBackClick = () => {
    navigate(-1);
  };

  const successCallback = () => {
    handleBackClick();
  };

  return (
    <FormPageLayout
      hasGroup
      metaSchema={metaSchema}
      getLogicConfig={getLogicConfig}
      extraLogicParams={{
        successCallback,
        action: apiUrl.create,
        extraParams: {},
        validateFormValues,
        formatFormValues,

      }}
      onBackClick={handleBackClick}
      components={{
        JsonPopover,
        RequestMethodSelect,

      }}
    />
  );
};

export default ValidateRulesCreate;

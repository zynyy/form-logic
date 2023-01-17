import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPageLayout, useJsonMetaSchema } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';

import { LinkConfig, apiUrl } from './service';

import { validateFormValues, formatFormValues } from './hooks';

interface LinkCreateProps {}

const LinkCreate: FC<LinkCreateProps> = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(LinkConfig.CREATE);

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
    />
  );
};

export default LinkCreate;

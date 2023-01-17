import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormPageLayout, useJsonMetaSchema } from '@formlogic/render';
import getLogicConfig from '@/low-code-meta/logic';

import { LinkConfig, apiUrl } from './service';
import { validateFormValues, formatFormValues, useLinkDetail } from './hooks';

interface LinkEditProps {}

const LinkEdit: FC<LinkEditProps> = () => {
  const navigate = useNavigate();

  const { metaSchema } = useJsonMetaSchema(LinkConfig.EDIT);

  const [formConfig, loading] = useLinkDetail();

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

export default LinkEdit;
